import { Prisma } from '@prisma/client';
import { prisma } from '../../db/prisma.js';

// This is the only file that touches the pgvector column. Prisma cannot read or write
// Unsupported types, so these queries use parameterized raw SQL.

const toVectorLiteral = (vector) => `[${vector.join(',')}]`;

export async function replaceDocumentChunks({ documentId, userId, chunks }) {
  await prisma.$transaction(async (tx) => {
    await tx.documentChunk.deleteMany({ where: { documentId } });

    const INSERT_BATCH = 100;
    for (let i = 0; i < chunks.length; i += INSERT_BATCH) {
      const rows = chunks.slice(i, i + INSERT_BATCH).map((chunk) => Prisma.sql`(
        ${documentId}, ${userId}, ${chunk.index}, ${chunk.content},
        ${JSON.stringify(chunk.metadata)}::jsonb, ${toVectorLiteral(chunk.embedding)}::vector, NOW()
      )`);
      await tx.$executeRaw`
        INSERT INTO "DocumentChunk" ("documentId", "userId", "chunkIndex", "content", "metadata", "embedding", "createdAt")
        VALUES ${Prisma.join(rows)}`;
    }
  }, { timeout: 60_000 });
}

export function deleteByDocument(documentId) {
  return prisma.documentChunk.deleteMany({ where: { documentId } });
}

/**
 * Cosine similarity search. Ownership is enforced in SQL on both the chunk and the
 * document, so a bug in a caller cannot return another user's material.
 */
export async function similaritySearch({ userId, embedding, limit, domain, documentIds }) {
  const vector = toVectorLiteral(embedding);
  const filters = [
    Prisma.sql`c."userId" = ${userId}`,
    Prisma.sql`d."userId" = ${userId}`,
    Prisma.sql`d."status" = 'INDEXED'::"DocumentStatus"`,
  ];
  if (domain) filters.push(Prisma.sql`d."domain" = ${domain}::"Domain"`);
  if (documentIds?.length) filters.push(Prisma.sql`c."documentId" IN (${Prisma.join(documentIds)})`);

  return prisma.$queryRaw`
    SELECT c."id"::text AS "id", c."documentId", c."chunkIndex", c."content", d."title",
           1 - (c."embedding" <=> ${vector}::vector) AS "score"
    FROM "DocumentChunk" c
    JOIN "Document" d ON d."id" = c."documentId"
    WHERE ${Prisma.join(filters, ' AND ')}
    ORDER BY c."embedding" <=> ${vector}::vector
    LIMIT ${limit}`;
}
