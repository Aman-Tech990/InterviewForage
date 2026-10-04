import { RAG } from '../../config/constants.js';
import { embedQuery } from '../embeddings/embeddingService.js';
import { similaritySearch } from '../repositories/chunkRepository.js';

/**
 * Returns the chunks most relevant to a query, from this user's indexed documents only.
 * Chunks below the minimum similarity are dropped so weak matches never reach a prompt.
 */
export async function retrieve({ userId, query, limit = RAG.topK, domain, documentIds, minScore = RAG.minScore }) {
  const embedding = await embedQuery(query);
  const rows = await similaritySearch({ userId, embedding, limit, domain, documentIds });
  return rows
    .map((row) => ({ ...row, score: Number(row.score) }))
    .filter((row) => row.score >= minScore);
}

/** Packs ranked chunks into a numbered context block within a character budget. */
export function buildContext(chunks, maxChars = RAG.maxContextChars) {
  const parts = [];
  const used = [];
  let total = 0;
  for (const chunk of chunks) {
    const entry = `[${used.length + 1}] (${chunk.title})\n${chunk.content}`;
    if (total + entry.length > maxChars && used.length > 0) break;
    parts.push(entry);
    used.push(chunk);
    total += entry.length;
  }
  return { context: parts.join('\n\n'), used };
}
