import { unprocessable } from '../../utils/errors.js';

// pdf-parse's package entry runs a debug routine when imported as an ES module,
// so the library file is imported directly.
async function readPdf(buffer) {
  const { default: parsePdf } = await import('pdf-parse/lib/pdf-parse.js');
  const result = await parsePdf(buffer);
  return result.text ?? '';
}

export async function extractText(buffer, mime) {
  try {
    return mime === 'application/pdf' ? await readPdf(buffer) : buffer.toString('utf-8');
  } catch {
    throw unprocessable('We could not read that file. If it is a PDF, make sure it is not password protected or corrupted.');
  }
}
