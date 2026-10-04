import { RAG } from '../../config/constants.js';
import { getLlmProvider } from '../../ai/llm/llmProvider.js';

// Embedding calls are batched to stay under provider request limits.
export async function embedTexts(texts) {
  const llm = getLlmProvider();
  const vectors = [];
  for (let i = 0; i < texts.length; i += RAG.embedBatchSize) {
    vectors.push(...await llm.embedDocuments(texts.slice(i, i + RAG.embedBatchSize)));
  }
  return vectors;
}

export const embedQuery = (query) => getLlmProvider().embedQuery(query);
