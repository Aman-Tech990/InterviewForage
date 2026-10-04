import { prisma } from '../db/prisma.js';

export const findById = (id) => prisma.document.findUnique({ where: { id } });
export const update = (id, data) => prisma.document.update({ where: { id }, data });
