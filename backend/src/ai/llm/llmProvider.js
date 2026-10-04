import { config } from '../../config/index.js';
import { serviceUnavailable } from '../../utils/errors.js';
import { GeminiProvider } from './geminiProvider.js';

/**
 * The rest of the backend talks to this interface and never to a vendor SDK.
 *
 * generateStructured({ template, variables, schema, name, temperature }) -> object
 * generateText({ template, variables, temperature }) -> string
 * streamText({ template, variables, temperature }) -> AsyncIterable<string>
 * embedDocuments(texts) -> number[][]
 * embedQuery(text) -> number[]
 * describeMedia({ buffer, mimeType, instruction }) -> string
 */
let provider;

export function getLlmProvider() {
  if (!config.ai.enabled) {
    throw serviceUnavailable(
      'The AI service is not configured on this server. Set GEMINI_API_KEY and try again.',
      { code: 'AI_NOT_CONFIGURED' },
    );
  }
  provider ??= new GeminiProvider(config.ai);
  return provider;
}
