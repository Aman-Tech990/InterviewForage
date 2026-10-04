import { prisma } from '../db/prisma.js';
import { getLlmProvider } from '../ai/llm/llmProvider.js';
import { codeReviewTemplate, STYLE } from '../ai/prompts.js';
import { codeReviewSchema } from '../ai/schemas.js';
import { notFound } from '../utils/errors.js';
import { skipTake, buildPagination } from '../utils/pagination.js';

export async function create(userId, { language, problemStatement, code }) {
  let result;
  try {
    result = await getLlmProvider().generateStructured({
      template: codeReviewTemplate,
      variables: { language, problem: problemStatement, code, style: STYLE },
      schema: codeReviewSchema,
      name: 'code_review',
      temperature: 0.2,
    });
  } catch (error) {
    await prisma.codeReview.create({ data: { userId, language, problemStatement, code, status: 'FAILED' } });
    throw error;
  }
  return prisma.codeReview.create({ data: { userId, language, problemStatement, code, result } });
}

export async function list(userId, { page, limit }) {
  const [items, total] = await Promise.all([
    prisma.codeReview.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      ...skipTake(page, limit),
      select: { id: true, language: true, status: true, createdAt: true, problemStatement: true, result: true },
    }),
    prisma.codeReview.count({ where: { userId } }),
  ]);
  return {
    items: items.map(({ result, ...rest }) => ({ ...rest, verdict: result?.verdict ?? null })),
    pagination: buildPagination(page, limit, total),
  };
}

export async function get(userId, id) {
  const review = await prisma.codeReview.findFirst({ where: { id, userId } });
  if (!review) throw notFound('We could not find that review.');
  return review;
}
