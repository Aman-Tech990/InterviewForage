import { z } from 'zod';

export const questionSchema = z.object({
  question: z.string().describe('One interview question exactly as the interviewer would say it.'),
});

// Rubric levels: 0 missing or wrong, 1 weak, 2 partial, 3 solid, 4 excellent. -1 = not observable.
export const turnSchema = z.object({
  evidenceQuote: z.string().describe('Exact words copied from the candidate answer that support your grading. Empty if the answer was empty.'),
  correctness: z.number().int().min(-1).max(4),
  reasoning: z.number().int().min(-1).max(4),
  communication: z.number().int().min(-1).max(4),
  strengths: z.array(z.string()),
  gaps: z.array(z.string()).describe('Short topic tags such as complexity analysis or edge cases.'),
  action: z.enum(['FOLLOW_UP', 'NEXT_QUESTION']),
  interviewerReply: z.string().describe('What the interviewer says next: one follow-up question, or the next new question.'),
});

export const reportSchema = z.object({
  summary: z.string(),
  strengths: z.array(z.string()),
  weaknesses: z.array(z.string()),
  recommendedTopics: z.array(z.object({ topic: z.string(), reason: z.string(), practice: z.string() })),
});

export const codeReviewSchema = z.object({
  summary: z.string(),
  verdict: z.enum(['CORRECT', 'MOSTLY_CORRECT', 'INCORRECT', 'INCOMPLETE']),
  timeComplexity: z.string(),
  spaceComplexity: z.string(),
  bugs: z.array(z.object({ description: z.string(), why: z.string() })),
  edgeCases: z.array(z.object({ case: z.string(), handled: z.boolean() })),
  readability: z.array(z.object({ observation: z.string(), why: z.string() })),
  suggestions: z.array(z.object({ title: z.string(), explanation: z.string(), why: z.string() })),
  improvedApproach: z.string(),
  improvedCode: z.string().describe('Minimal corrected code only if there is a correctness problem, otherwise an empty string.'),
});
