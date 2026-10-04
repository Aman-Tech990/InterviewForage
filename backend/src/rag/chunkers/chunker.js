import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { RAG } from '../../config/constants.js';
import { cleanText } from './cleanText.js';

const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: RAG.chunkSize,
  chunkOverlap: RAG.chunkOverlap,
});

/** Splits cleaned text on paragraph, then sentence, then word boundaries. */
export async function chunkText(text) {
  const pieces = await splitter.splitText(cleanText(text));
  return pieces.map((content) => content.trim()).filter((content) => content.length > 20);
}
