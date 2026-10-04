import { RAG } from '../../config/constants.js';
import * as documentRepository from '../../repositories/documentRepository.js';
import { chunkText } from '../chunkers/chunker.js';
import { embedTexts } from '../embeddings/embeddingService.js';
import { replaceDocumentChunks } from '../repositories/chunkRepository.js';
import { logger } from '../../utils/logger.js';

/**
 * Document -> chunks -> embeddings -> pgvector. Runs in the background after upload and
 * again on re-index. The status field is the contract with the UI: PROCESSING while this
 * runs, then INDEXED or FAILED with a message the user can act on.
 */
export async function ingestDocument(documentId) {
  const document = await documentRepository.findById(documentId);
  if (!document) return;

  await documentRepository.update(documentId, { status: 'PROCESSING', errorMessage: null });

  try {
    const pieces = await chunkText(document.rawText);
    if (pieces.length === 0) throw new Error('No readable text was found in this document.');
    if (pieces.length > RAG.maxChunksPerDocument) {
      throw new Error(`This document is too long to index (${pieces.length} sections). Split it into smaller files.`);
    }

    const embeddings = await embedTexts(pieces);
    await replaceDocumentChunks({
      documentId,
      userId: document.userId,
      chunks: pieces.map((content, index) => ({
        index,
        content,
        embedding: embeddings[index],
        metadata: { title: document.title },
      })),
    });

    await documentRepository.update(documentId, { status: 'INDEXED', chunkCount: pieces.length, errorMessage: null });
    logger.info('Document indexed', { documentId, chunks: pieces.length });
  } catch (error) {
    logger.error('Document indexing failed', error);
    await documentRepository.update(documentId, {
      status: 'FAILED',
      errorMessage: 'We could not index this document. Try re-indexing it, or upload a smaller file.',
    });
  }
}
