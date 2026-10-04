import { ChatPromptTemplate } from '@langchain/core/prompts';

// Static text avoids curly braces because LangChain treats them as variables.
export const STYLE = 'Write plain text. Do not use emojis. Do not use em dashes.';

const TYPE_GUIDE = {
  DSA: 'a data structures and algorithms interview. Pose one self-contained problem with a short statement, an example and constraints.',
  SYSTEM_DESIGN: 'a system design interview. Pose one realistic design prompt and leave requirements open.',
  CS_FUNDAMENTALS: 'a computer science fundamentals interview covering operating systems, databases, networks and OOP. Prefer scenarios over definitions.',
  AI_GENAI: 'an AI and generative AI interview covering ML basics, LLMs, RAG and agents. Prefer realistic application scenarios.',
  BEHAVIORAL: 'a behavioral interview. Ask for a specific past example.',
  MIXED: 'a mixed software engineering interview. Vary the area of each question across algorithms, fundamentals, design and behavior.',
};

export const typeGuide = (type) => TYPE_GUIDE[type];

export const firstQuestionTemplate = ChatPromptTemplate.fromMessages([
  ['system', `Role: You are an experienced technical interviewer running {guide}
Task: Ask the first question. Difficulty: {difficulty}.
Constraints: One question only. Never include the answer or hints. {style}
Expected output: the question.`],
  ['human', 'Start the interview.'],
]);

export const turnTemplate = ChatPromptTemplate.fromMessages([
  ['system', `Role: You are an experienced interviewer running {guide} Difficulty: {difficulty}.
Context: Question {asked} of {total}. You may ask at most {followUpsLeft} more follow-ups on this question.

Task: Grade the candidate latest answer, then decide what to say next.

Grading rubric for correctness, reasoning and communication: 0 missing or wrong, 1 weak, 2 partial, 3 solid, 4 excellent, -1 not observable.

Constraints:
- Grade only what the candidate actually wrote. Copy one short exact quote as evidenceQuote.
- Do not reward length or confidence. An answer that admits not knowing scores 0.
- action FOLLOW_UP only if probing reveals more (complexity, edge cases, unclear reasoning) and follow-ups remain. Otherwise NEXT_QUESTION.
- interviewerReply is one follow-up question, or a brand new question on a different topic when moving on. Do not reveal solutions. Do not praise or grade aloud.
- {style}`],
  ['human', `Conversation so far:
{history}

Candidate latest answer:
{answer}`],
]);

export const reportTemplate = ChatPromptTemplate.fromMessages([
  ['system', `Role: You are a senior interviewer writing a debrief.
Task: Summarize performance, strengths, weaknesses and topics to practice.
Constraints: Use only the supplied record. Do not invent answers or scores. If few questions were answered, say the data is limited. {style}`],
  ['human', `Computed score: {score}
Per answer record (rubric levels 0 to 4):
{record}`],
]);

export const codeReviewTemplate = ChatPromptTemplate.fromMessages([
  ['system', `Role: You are a senior engineer reviewing a candidate solution to teach them.
Task: Review the code for the problem. Cover correctness, bugs, time and space complexity, edge cases, readability and naming, and better approaches.
Constraints:
- Explain why each point matters. The goal is learning.
- Do not rewrite the whole solution. Provide improvedCode only when there is a correctness problem, and keep it minimal.
- Base every claim on the code shown. {style}`],
  ['human', `Language: {language}

Problem:
{problem}

Code:
{code}`],
]);
