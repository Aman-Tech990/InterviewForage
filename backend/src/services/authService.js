import bcrypt from 'bcryptjs';
import { prisma } from '../db/prisma.js';
import { BCRYPT_ROUNDS } from '../config/constants.js';
import { signToken } from '../middlewares/authMiddleware.js';
import { conflict, unauthorized } from '../utils/errors.js';

const publicUser = { id: true, email: true, name: true, createdAt: true };

// Compared against when the email is unknown so response time does not reveal which emails exist.
const DUMMY_HASH = bcrypt.hashSync('not-a-real-password', BCRYPT_ROUNDS);

export async function register({ email, password, name }) {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw conflict('An account with this email already exists.');

  const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);
  const user = await prisma.user.create({ data: { email, passwordHash, name }, select: publicUser });
  return { user, token: signToken(user.id) };
}

export async function login({ email, password }) {
  const record = await prisma.user.findUnique({ where: { email } });
  const valid = await bcrypt.compare(password, record?.passwordHash ?? DUMMY_HASH);
  if (!record || !valid) throw unauthorized('Email or password is incorrect.');

  const { passwordHash, ...user } = record; // eslint-disable-line no-unused-vars
  return { user: { id: user.id, email: user.email, name: user.name, createdAt: user.createdAt }, token: signToken(user.id) };
}
