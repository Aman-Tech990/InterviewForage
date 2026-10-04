# Interview Forage

Technical interview practice with an AI interviewer, code review with explanations, and a community knowledge base of interview experiences.

- Frontend: React, Vite, Tailwind CSS, Monaco Editor (deploy on Vercel)
- Backend: Node.js, Express, Prisma (deploy on Render)
- Database: Neon PostgreSQL with pgvector
- AI: Google Gemini, called through the API only (LangChain.js wrapper). No local models or heavy computation.

## What works today

| Area | Status |
| --- | --- |
| Register, login, JWT, protected routes | Working |
| Mock interview (DSA, system design, CS, AI, behavioral, mixed) | Working. Each turn is one Gemini call that grades the answer and writes the next question |
| Rubric scoring | Scores are computed from 0 to 4 rubric levels in code, quotes are checked against the real answer |
| Code review (Java, JavaScript, Python, C++) | Working |
| Interview experiences (create, edit, delete, search, filter) | Working, labelled user-submitted |
| RAG (`backend/src/rag`) | Built, **not connected** to any route (see below) |

## RAG module (built, not mounted)

```
document -> loaders -> clean + chunk -> Gemini embeddings (API) -> pgvector in Neon
         -> retriever (cosine similarity, filtered by user) -> prompt -> Gemini
```

Files live in `backend/src/rag`. The `Document` and `DocumentChunk` tables exist in the schema, with a `vector(768)` column. Every query filters by owner in SQL. No route imports the module. To connect it later, add upload, search and ask routes in `backend/src/routes/index.js` that call `pipeline/ingestionPipeline.js` and `retriever/retriever.js`.

## Local setup

1. Create a Neon project, copy the pooled and direct connection strings.
2. Backend:
   ```
   cd backend
   cp .env.example .env      # fill DATABASE_URL, DIRECT_URL, JWT_SECRET, GEMINI_API_KEY
   npm install
   npx prisma migrate dev --name init
   npm run dev
   ```
   The schema uses `extensions = [vector]`, so Prisma creates the pgvector extension on Neon during the first migration.
3. Frontend:
   ```
   cd frontend
   npm install
   npm run dev
   ```
   Vite proxies `/api` to `http://localhost:4000`.

On Windows PowerShell use `copy .env.example .env` instead of `cp`.

## Deploy

**Backend on Render.** Create a Web Service from this repo with root directory `backend` (or use `render.yaml`).
Build: `npm install && npx prisma migrate deploy`. Start: `npm start`.
Set `DATABASE_URL`, `DIRECT_URL`, `JWT_SECRET`, `GEMINI_API_KEY` and `FRONTEND_URL` (your Vercel URL, no trailing slash; comma separate several).

**Frontend on Vercel.** Import the repo with root directory `frontend`, framework Vite.
Set `VITE_API_URL` to `https://<your-render-service>.onrender.com/api`. `vercel.json` already rewrites all paths to the app.

## API

All responses are `{ "success": true, "data": ... }` or `{ "success": false, "message": ..., "error": ... }`.

| Method | Path | Auth |
| --- | --- | --- |
| POST | /api/auth/register, /api/auth/login | no |
| GET | /api/auth/me | yes |
| POST | /api/auth/logout | yes |
| GET, POST | /api/interviews | yes |
| GET | /api/interviews/:id | yes |
| POST | /api/interviews/:id/answer, /api/interviews/:id/finish | yes |
| GET, POST | /api/code-reviews | yes |
| GET | /api/code-reviews/:id | yes |
| GET, POST | /api/experiences | yes |
| GET, PATCH, DELETE | /api/experiences/:id | yes (edit and delete: author only) |

## Layout

```
backend/src
  config/        env validation, constants
  routes/        route table only
  controllers/   thin request handlers
  services/      business logic and Gemini calls
  ai/            Gemini provider, prompts, structured output schemas
  rag/           document pipeline (not mounted)
  middlewares/   auth, validation, errors, rate limits
  utils/         logger, errors, pagination, evidence check
frontend/src
  pages/ components/ context/ hooks/ lib/api.js (single Axios client)
```

## Notes

- Interview answers are not streamed; each turn is a single request.
- Rate limiting is in memory, which suits one Render instance.
- Tests: `cd backend && npm test` (Node built-in runner).
