// Values that are product decisions rather than deployment settings.
// Changing the embedding dimension requires a database migration, so it is not an env var.
export const EMBEDDING_DIMENSIONS = 768;

export const RAG = {
  chunkSize: 1000,
  chunkOverlap: 150,
  topK: 5,
  minScore: 0.35,
  maxContextChars: 6000,
  embedBatchSize: 32,
  maxChunksPerDocument: 600,
  maxDocumentsPerUser: 25,
  maxTextChars: 600_000,
};

export const UPLOAD_LIMITS = {
  imageBytes: 5 * 1024 * 1024,
  videoBytes: 20 * 1024 * 1024,
  documentBytes: 10 * 1024 * 1024,
};

export const CODE_REVIEW_LANGUAGES = ['Java', 'JavaScript', 'Python', 'C++'];
export const PROGRAMMING_LANGUAGES = ['Java', 'JavaScript', 'Python', 'C++', 'TypeScript', 'Go', 'C#'];

// An experience is hidden pending admin review once this many open reports exist.
export const REPORT_HIDE_THRESHOLD = 3;

export const PASSWORD_MIN_LENGTH = 8;
export const BCRYPT_ROUNDS = 12;
