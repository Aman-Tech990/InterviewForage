import rateLimit from 'express-rate-limit';
import { tooManyRequests } from '../utils/errors.js';

// In-memory counters are enough for a single Render instance. If the API is ever
// scaled horizontally, move the store to a shared backend such as Redis.
function createLimiter({ windowMs, limit, message, keyByUser = false }) {
  return rateLimit({
    windowMs,
    limit,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    // Passing keyGenerator: undefined would override the library default, so spread conditionally.
    ...(keyByUser && { keyGenerator: (req) => req.user?.id ?? req.ip }),
    handler: (_req, _res, next) => next(tooManyRequests(message)),
  });
}

export const apiLimiter = createLimiter({ windowMs: 15 * 60 * 1000, limit: 600, message: 'Too many requests from this network. Please slow down.' });
export const authLimiter = createLimiter({ windowMs: 15 * 60 * 1000, limit: 30, message: 'Too many sign-in attempts. Please wait a few minutes.' });
export const aiLimiter = createLimiter({ windowMs: 60 * 1000, limit: 30, keyByUser: true, message: 'You are sending requests quickly. Wait a moment before the next one.' });
export const uploadLimiter = createLimiter({ windowMs: 10 * 60 * 1000, limit: 30, keyByUser: true, message: 'Too many uploads. Please try again in a few minutes.' });
