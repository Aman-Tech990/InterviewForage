import { prisma } from '../db/prisma.js';
import { forbidden, notFound } from '../utils/errors.js';
import { skipTake, buildPagination } from '../utils/pagination.js';

const withAuthor = { author: { select: { id: true, name: true } } };

// Experiences are always labelled as user submitted. They are never presented as verified facts.
const present = (e, userId) => ({ ...e, source: 'USER_SUBMITTED', isMine: e.authorId === userId });

export async function list(userId, { page, limit, q, interviewType, difficulty }) {
  const where = {
    ...(interviewType && { interviewType }),
    ...(difficulty && { difficulty }),
    ...(q && {
      OR: ['company', 'role', 'questions'].map((field) => ({ [field]: { contains: q, mode: 'insensitive' } })),
    }),
  };
  const [items, total] = await Promise.all([
    prisma.experience.findMany({ where, orderBy: { createdAt: 'desc' }, ...skipTake(page, limit), include: withAuthor }),
    prisma.experience.count({ where }),
  ]);
  return { items: items.map((e) => present(e, userId)), pagination: buildPagination(page, limit, total) };
}

export async function get(userId, id) {
  const experience = await prisma.experience.findUnique({ where: { id }, include: withAuthor });
  if (!experience) throw notFound('We could not find that experience.');
  return present(experience, userId);
}

export const create = (userId, data) => prisma.experience.create({ data: { ...data, authorId: userId } });

async function assertAuthor(userId, id) {
  const existing = await prisma.experience.findUnique({ where: { id }, select: { authorId: true } });
  if (!existing) throw notFound('We could not find that experience.');
  if (existing.authorId !== userId) throw forbidden('Only the author can change this experience.');
}

export async function update(userId, id, data) {
  await assertAuthor(userId, id);
  return prisma.experience.update({ where: { id }, data });
}

export async function remove(userId, id) {
  await assertAuthor(userId, id);
  await prisma.experience.delete({ where: { id } });
}
