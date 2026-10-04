import { prisma } from '../db/prisma.js';
import { getLlmProvider } from '../ai/llm/llmProvider.js';
import { firstQuestionTemplate, reportTemplate, turnTemplate, typeGuide, STYLE } from '../ai/prompts.js';
import { questionSchema, reportSchema, turnSchema } from '../ai/schemas.js';
import { verifyEvidence } from '../utils/evidence.js';
import { conflict, notFound } from '../utils/errors.js';
import { skipTake, buildPagination } from '../utils/pagination.js';
import { truncate } from '../utils/text.js';

const MAX_FOLLOW_UPS = 2;
const HISTORY_WINDOW = 8;
const mean = (values) => values.reduce((a, b) => a + b, 0) / values.length;

// Score is computed from rubric levels (0 to 4), never taken from the model as a number.
function scoreFromLevels(levels) {
  const observed = levels.filter((l) => l >= 0);
  return observed.length === 0 ? 0 : Math.round((mean(observed) / 4) * 100);
}

async function findOwned(id, userId) {
  const interview = await prisma.interview.findFirst({
    where: { id, userId },
    include: { messages: { orderBy: { createdAt: 'asc' } } },
  });
  if (!interview) throw notFound('We could not find that interview.');
  return interview;
}

// Evaluations stay hidden until the interview is complete, like a real interview.
function present(interview) {
  const done = interview.status === 'COMPLETED';
  return {
    ...interview,
    messages: interview.messages.map((m) => ({
      id: m.id,
      role: m.role,
      content: m.content,
      createdAt: m.createdAt,
      kind: m.role === 'INTERVIEWER' ? m.meta?.kind ?? 'QUESTION' : 'ANSWER',
      evaluation: done && m.role === 'CANDIDATE' ? m.meta : undefined,
    })),
  };
}

export async function create(userId, { type, difficulty, questionCount }) {
  const llm = getLlmProvider();
  const { question } = await llm.generateStructured({
    template: firstQuestionTemplate,
    variables: { guide: typeGuide(type), difficulty, style: STYLE },
    schema: questionSchema,
    name: 'first_question',
    temperature: 0.8,
  });

  const interview = await prisma.interview.create({
    data: {
      userId, type, difficulty, questionCount,
      messages: { create: { role: 'INTERVIEWER', content: question.trim(), meta: { kind: 'QUESTION' } } },
    },
    include: { messages: { orderBy: { createdAt: 'asc' } } },
  });
  return present(interview);
}

export async function list(userId, { page, limit }) {
  const [items, total] = await Promise.all([
    prisma.interview.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      ...skipTake(page, limit),
      select: { id: true, type: true, difficulty: true, status: true, score: true, questionCount: true, questionsAsked: true, createdAt: true },
    }),
    prisma.interview.count({ where: { userId } }),
  ]);
  return { items, pagination: buildPagination(page, limit, total) };
}

export async function get(userId, id) {
  return present(await findOwned(id, userId));
}

export async function answer(userId, id, text) {
  const interview = await findOwned(id, userId);
  if (interview.status !== 'ACTIVE') throw conflict('This interview is already finished.');

  // Follow-ups used on the current question: interviewer messages since the last new question.
  const interviewerMessages = interview.messages.filter((m) => m.role === 'INTERVIEWER');
  let followUpsUsed = 0;
  for (let i = interviewerMessages.length - 1; i >= 0 && interviewerMessages[i].meta?.kind === 'FOLLOW_UP'; i -= 1) followUpsUsed += 1;
  const followUpsLeft = MAX_FOLLOW_UPS - followUpsUsed;

  const history = interview.messages
    .slice(-HISTORY_WINDOW)
    .map((m) => `${m.role === 'CANDIDATE' ? 'Candidate' : 'Interviewer'}: ${truncate(m.content, 1200)}`)
    .join('\n');

  const turn = await getLlmProvider().generateStructured({
    template: turnTemplate,
    variables: {
      guide: typeGuide(interview.type), difficulty: interview.difficulty,
      asked: interview.questionsAsked, total: interview.questionCount,
      followUpsLeft, history, answer: text, style: STYLE,
    },
    schema: turnSchema,
    name: 'interview_turn',
    temperature: 0.4,
  });

  const quoteIsReal = verifyEvidence([{ quote: turn.evidenceQuote, observation: '' }], text).verified.length === 1;
  const levels = [turn.correctness, turn.reasoning, turn.communication];
  const evaluation = {
    score: scoreFromLevels(levels),
    correctness: turn.correctness, reasoning: turn.reasoning, communication: turn.communication,
    evidenceQuote: quoteIsReal ? turn.evidenceQuote : '',
    strengths: turn.strengths.slice(0, 4),
    gaps: turn.gaps.slice(0, 4),
  };

  const wantsFollowUp = turn.action === 'FOLLOW_UP' && followUpsLeft > 0;
  const finished = !wantsFollowUp && interview.questionsAsked >= interview.questionCount;

  await prisma.interviewMessage.create({ data: { interviewId: id, role: 'CANDIDATE', content: text, meta: evaluation } });

  if (finished) return finish(userId, id);

  await prisma.$transaction([
    prisma.interviewMessage.create({
      data: { interviewId: id, role: 'INTERVIEWER', content: turn.interviewerReply.trim(), meta: { kind: wantsFollowUp ? 'FOLLOW_UP' : 'QUESTION' } },
    }),
    prisma.interview.update({ where: { id }, data: wantsFollowUp ? {} : { questionsAsked: { increment: 1 } } }),
  ]);
  return present(await findOwned(id, userId));
}

export async function finish(userId, id) {
  const interview = await findOwned(id, userId);
  if (interview.status === 'COMPLETED') return present(interview);

  const answered = interview.messages.filter((m) => m.role === 'CANDIDATE' && m.meta);
  const score = answered.length ? Math.round(mean(answered.map((m) => m.meta.score))) : null;

  let report = null;
  if (answered.length > 0) {
    report = await getLlmProvider().generateStructured({
      template: reportTemplate,
      variables: {
        score: score ?? 'not available',
        record: answered
          .map((m, i) => `${i + 1}. correctness ${m.meta.correctness}, reasoning ${m.meta.reasoning}, communication ${m.meta.communication}. Gaps: ${m.meta.gaps.join(', ') || 'none'}. Answer: ${truncate(m.content, 300)}`)
          .join('\n'),
        style: STYLE,
      },
      schema: reportSchema,
      name: 'interview_report',
      temperature: 0.3,
    });
  }

  await prisma.interview.update({ where: { id }, data: { status: 'COMPLETED', score, report, completedAt: new Date() } });
  return present(await findOwned(id, userId));
}
