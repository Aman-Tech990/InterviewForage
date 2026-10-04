# RAG module (built, not mounted)

Document -> loaders/textLoader -> chunkers (clean + split) -> embeddings (Gemini API)
-> repositories/chunkRepository (pgvector in Neon) -> retriever -> prompts/ragPrompts -> Gemini.

All model work is Gemini API calls through src/ai/llm. Nothing here runs on the server's CPU
beyond text splitting. No route imports this folder yet. To connect it later, add upload,
search and ask routes that call pipeline/ingestionPipeline.js and retriever/retriever.js.
