import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';
import { prisma } from '../db/prisma.js';
import { unauthorized } from '../utils/errors.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export function signToken(userId) {
  return jwt.sign({}, config.jwt.secret, { subject: userId, expiresIn: config.jwt.expiresIn });
}

function readBearerToken(req) {
  const header = req.headers.authorization ?? '';
  const [scheme, token] = header.split(' ');
  return scheme === 'Bearer' && token ? token : null;
}

// The user is loaded on every request so a deleted account stops working immediately,
// instead of staying valid until the token expires.
export const requireAuth = asyncHandler(async (req, _res, next) => {
  const token = readBearerToken(req);
  if (!token) throw unauthorized();

  let payload;
  try {
    payload = jwt.verify(token, config.jwt.secret);
  } catch {
    throw unauthorized('Your session has expired. Please sign in again.');
  }

  const user = await prisma.user.findUnique({
    where: { id: payload.sub },
    select: { id: true, email: true, name: true },
  });
  if (!user) throw unauthorized('Your session is no longer valid. Please sign in again.');

  req.user = user;
  next();
});
