import { z } from 'zod';
import { PASSWORD_MIN_LENGTH, CODE_REVIEW_LANGUAGES } from './config/constants.js';

const text = (max) => z.string().trim().min(1).max(max);
const optionalText = (max) => z.string().trim().max(max).optional().transform((v) => v || undefined);

export const idParam = z.object({ id: z.string().min(10).max(40) });
export const pageQuery = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
});

const email = z.string().trim().toLowerCase().email().max(254);

export const registerBody = z.object({
  name: text(80),
  email,
  password: z.string().min(PASSWORD_MIN_LENGTH, `Use at least ${PASSWORD_MIN_LENGTH} characters.`).max(128)
    .refine((p) => /[A-Za-z]/.test(p) && /\d/.test(p), 'Include at least one letter and one number.'),
});
export const loginBody = z.object({ email, password: z.string().min(1).max(128) });

export const createInterviewBody = z.object({
  type: z.enum(['DSA', 'SYSTEM_DESIGN', 'CS_FUNDAMENTALS', 'AI_GENAI', 'BEHAVIORAL', 'MIXED']),
  difficulty: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']),
  questionCount: z.coerce.number().int().min(2).max(10).default(5),
});
export const answerBody = z.object({ answer: z.string().trim().min(1, 'Write an answer first.').max(8000) });

export const codeReviewBody = z.object({
  language: z.enum(CODE_REVIEW_LANGUAGES),
  problemStatement: text(4000),
  code: text(20000),
});

export const experienceBody = z.object({
  company: text(100),
  role: text(100),
  round: text(100),
  interviewType: z.enum(['DSA', 'SYSTEM_DESIGN', 'CS_FUNDAMENTALS', 'AI_GENAI', 'BEHAVIORAL', 'MIXED']),
  difficulty: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']),
  questions: text(5000),
  preparation: optionalText(3000),
  overall: text(5000),
  advice: optionalText(3000),
});
export const experienceQuery = pageQuery.extend({
  q: z.string().trim().max(100).optional(),
  interviewType: z.enum(['DSA', 'SYSTEM_DESIGN', 'CS_FUNDAMENTALS', 'AI_GENAI', 'BEHAVIORAL', 'MIXED']).optional(),
  difficulty: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']).optional(),
});
