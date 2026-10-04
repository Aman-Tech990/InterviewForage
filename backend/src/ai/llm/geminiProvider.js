import { ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings } from '@langchain/google-genai';
import { HumanMessage } from '@langchain/core/messages';
import { EMBEDDING_DIMENSIONS } from '../../config/constants.js';
import { badGateway, serviceUnavailable } from '../../utils/errors.js';
import { logger } from '../../utils/logger.js';

const MAX_ATTEMPTS = 2;
const RETRY_DELAY_MS = 600;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function contentToText(content) {
  if (typeof content === 'string') return content;
  if (Array.isArray(content)) return content.map((part) => (typeof part === 'string' ? part : part?.text ?? '')).join('');
  return '';
}

function translateError(error) {
  const text = String(error?.message ?? error);
  if (/429|quota|rate limit|resource exhausted/i.test(text)) {
    return serviceUnavailable('The AI service is busy right now. Please try again in a minute.', { code: 'AI_RATE_LIMITED' });
  }
  return badGateway('The AI service could not complete that request. Please try again.', { code: 'AI_FAILED' });
}

// Matryoshka-style embedding models can be shortened to a smaller prefix as long as the
// result is re-normalized. This keeps the vector column size fixed even if a model
// returns its full width.
function fitDimensions(vector) {
  if (vector.length === EMBEDDING_DIMENSIONS) return vector;
  if (vector.length < EMBEDDING_DIMENSIONS) {
    throw badGateway(`The embedding model returned ${vector.length} dimensions but ${EMBEDDING_DIMENSIONS} are required.`, { code: 'EMBEDDING_DIMENSION_MISMATCH' });
  }
  const cut = vector.slice(0, EMBEDDING_DIMENSIONS);
  const norm = Math.sqrt(cut.reduce((sum, v) => sum + v * v, 0)) || 1;
  return cut.map((v) => v / norm);
}

export class GeminiProvider {
  constructor({ apiKey, model, embeddingModel }) {
    this.apiKey = apiKey;
    this.model = model;
    this.embeddingModel = embeddingModel;
    this.chatModels = new Map();
    this.embedders = new Map();
  }

  chat(temperature) {
    if (!this.chatModels.has(temperature)) {
      this.chatModels.set(temperature, new ChatGoogleGenerativeAI({ apiKey: this.apiKey, model: this.model, temperature }));
    }
    return this.chatModels.get(temperature);
  }

  embedder(taskType) {
    if (!this.embedders.has(taskType)) {
      this.embedders.set(
        taskType,
        new GoogleGenerativeAIEmbeddings({
          apiKey: this.apiKey,
          model: this.embeddingModel,
          taskType,
          outputDimensionality: EMBEDDING_DIMENSIONS,
        }),
      );
    }
    return this.embedders.get(taskType);
  }

  async withRetry(label, operation) {
    let lastError;
    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;
        logger.warn(`Gemini call failed (${label}, attempt ${attempt}/${MAX_ATTEMPTS})`, error);
        if (attempt < MAX_ATTEMPTS) await sleep(RETRY_DELAY_MS * attempt);
      }
    }
    throw translateError(lastError);
  }

  async generateStructured({ template, variables, schema, name, temperature = 0.3 }) {
    const messages = await template.formatMessages(variables);
    const structured = this.chat(temperature).withStructuredOutput(schema, { name });
    return this.withRetry(name, () => structured.invoke(messages));
  }

  async generateText({ template, variables, temperature = 0.5 }) {
    const messages = await template.formatMessages(variables);
    const response = await this.withRetry('text', () => this.chat(temperature).invoke(messages));
    return contentToText(response.content).trim();
  }

  // Streaming is not retried: once tokens have reached the browser a retry would
  // duplicate text. A failure before the first token surfaces as a normal error.
  async *streamText({ template, variables, temperature = 0.6 }) {
    const messages = await template.formatMessages(variables);
    try {
      const stream = await this.chat(temperature).stream(messages);
      for await (const chunk of stream) {
        const text = contentToText(chunk.content);
        if (text) yield text;
      }
    } catch (error) {
      logger.warn('Gemini stream failed', error);
      throw translateError(error);
    }
  }

  async embedDocuments(texts) {
    const vectors = await this.withRetry('embedDocuments', () => this.embedder('RETRIEVAL_DOCUMENT').embedDocuments(texts));
    return vectors.map(fitDimensions);
  }

  async embedQuery(text) {
    const vector = await this.withRetry('embedQuery', () => this.embedder('RETRIEVAL_QUERY').embedQuery(text));
    return fitDimensions(vector);
  }

  // Gemini accepts audio and video as inline data, which is how recorded answers are transcribed.
  async describeMedia({ buffer, mimeType, instruction }) {
    const message = new HumanMessage({
      content: [
        { type: 'text', text: instruction },
        { type: 'media', mimeType, data: buffer.toString('base64') },
      ],
    });
    const response = await this.withRetry('describeMedia', () => this.chat(0).invoke([message]));
    return contentToText(response.content).trim();
  }
}
