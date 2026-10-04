# ✨ Interview Forage

> **Interview Forage is not just another interview preparation platform. It is the place where interview preparation turns into an actual interview experience.**

Every interview starts with the same problem.

You know DSA. You have worked on projects. You have studied CS fundamentals. You may even understand system design and modern AI concepts.

But when someone suddenly sits across from you and asks a question, everything feels different.

You have to think.  
You have to explain.  
You have to defend your answer.  
You have to write code.  
You have to handle follow-up questions.  
And most importantly, you have to communicate like a real candidate.

**Interview Forage was built around that exact experience.** 🎤

Instead of simply showing a list of questions, the platform creates an interview environment where an AI interviewer asks questions, evaluates answers, follows up when needed, generates a final report, reviews code, and lets candidates learn from real interview experiences and their own study material.

The result is a full-stack AI interview preparation platform built with **React + Tailwind CSS + Node.js + Express + Prisma + Neon PostgreSQL + Gemini + LangChain + RAG**. 🧠

---

# 🌱 The Story Behind Interview Forage

The idea was simple.

> **What if interview preparation could feel less like solving random questions and more like sitting inside an actual interview room?**

That question shaped the entire application.

A candidate first creates an account and enters the platform.

From there, the candidate can start an interview based on the area they want to practice.

Maybe it is **DSA**.  
Maybe it is **System Design**.  
Maybe it is **CS Fundamentals**.  
Maybe it is **AI and GenAI**.  
Maybe it is **Behavioral**.  
Or maybe the candidate wants a **Mixed Interview** that feels closer to a real software engineering interview.

The candidate chooses the difficulty and the number of questions.

Then the room opens.

The first question arrives from the AI interviewer.

The candidate answers.

The AI does not simply say "correct" or "wrong".

It looks at the answer through multiple dimensions such as **correctness, reasoning, and communication**.

If the answer needs clarification, the interviewer can ask a follow-up.

If the answer is strong, the interview moves forward.

At the end, the candidate gets a complete interview report instead of a meaningless percentage.

That is the core idea behind Interview Forage:

> **Practice the interview, not just the question.**

---

# ✨ What Interview Forage Brings Together

Interview Forage brings multiple parts of interview preparation into one system.

### 🎤 AI Mock Interviews

The platform creates dynamic interviews using Gemini and LangChain.

The interviewer understands the selected interview domain, difficulty, previous conversation, candidate answer, and remaining questions before deciding what happens next.

### 🧠 AI Evaluation

Every candidate answer is evaluated across:

- ✅ Correctness
- 🧩 Reasoning
- 💬 Communication
- 🔎 Evidence from the actual answer
- 💪 Strengths
- 📌 Gaps

The final score is calculated from the evaluation rubric rather than blindly trusting a model-generated number.

### 🔁 Follow-Up Questions

Real interviewers do not always move to the next question.

Sometimes they ask:

> "Why did you choose this approach?"

Or:

> "Can you optimize this?"

Or:

> "What happens in this edge case?"

Interview Forage brings that behavior into the interview flow.

A question can receive follow-ups before the interview moves forward.

### 💻 AI Code Review

Candidates can submit code along with the programming language and problem statement.

Gemini analyzes the submission and returns a structured code review.

This turns Interview Forage into more than a mock interview platform.

It also becomes a personal code-review workspace.

### 📚 Interview Experience Library

Candidates can share interview experiences containing:

- 🏢 Company
- 💼 Role
- 🧪 Interview round
- 🎯 Interview type
- 📈 Difficulty
- ❓ Questions
- 📖 Preparation strategy
- 📝 Overall experience
- 💡 Advice

The community side of the platform helps one candidate learn from another candidate's experience.

### 📄 RAG-Powered Personal Knowledge Layer

Interview Forage also brings the candidate's own study material into the AI workflow.

Documents can be processed into clean text, divided into meaningful chunks, converted into embeddings, stored as vectors in Neon PostgreSQL using pgvector, and retrieved semantically when the candidate needs context.

This means the AI can work with knowledge that belongs to the candidate instead of depending only on generic model knowledge.

---

# 🏗️ The Architecture

The architecture follows a clean full-stack flow where every layer has a clear responsibility.

```text
                         ┌─────────────────────────┐
                         │       React Client      │
                         │   Vite + Tailwind CSS   │
                         └────────────┬────────────┘
                                      │
                                      │ REST API
                                      ▼
                         ┌─────────────────────────┐
                         │     Node.js + Express   │
                         │ Authentication + API    │
                         │ Validation + Services   │
                         └────────────┬────────────┘
                                      │
                       ┌──────────────┴──────────────┐
                       │                             │
                       ▼                             ▼
             ┌──────────────────┐          ┌──────────────────┐
             │ Prisma ORM       │          │ Gemini + LangChain│
             │ Data Layer       │          │ AI Intelligence  │
             └────────┬─────────┘          └────────┬─────────┘
                      │                             │
                      ▼                             │
             ┌──────────────────┐                    │
             │ Neon PostgreSQL  │◄───────────────────┘
             │ Relational Data  │
             │ + pgvector       │
             └────────┬─────────┘
                      │
                      ▼
             ┌──────────────────┐
             │ RAG Knowledge    │
             │ Chunking         │
             │ Embeddings       │
             │ Retrieval        │
             └──────────────────┘
```

The important part is that AI is not sitting separately from the application.

It is part of the application flow.

The frontend collects the candidate's intent.

Express receives and validates it.

The service layer decides what needs to happen.

Prisma handles persistent application data.

Gemini handles reasoning and generation.

The RAG layer brings relevant candidate knowledge into the context.

Neon PostgreSQL keeps the application state and vector knowledge in one reliable database layer.

---

# 🧰 Technology Stack

| Layer | Technology | Why it is here |
|---|---|---|
| 🎨 Frontend | React 18 | Component-based application UI |
| ⚡ Build Tool | Vite | Fast development and production builds |
| 🎨 Styling | Tailwind CSS | Consistent and responsive UI |
| 🧭 Routing | React Router | Application navigation and protected pages |
| 🌐 HTTP Client | Axios | Communication with the backend API |
| 💻 Code Editor | Monaco Editor | Rich coding experience for code review |
| 🟢 Backend | Node.js | JavaScript runtime for the API |
| 🚂 API | Express.js | REST API and middleware architecture |
| 🗄️ ORM | Prisma | Type-safe database access |
| 🐘 Database | PostgreSQL | Application data storage |
| ☁️ Database Hosting | Neon | Managed PostgreSQL infrastructure |
| 🧠 Vector Search | pgvector | Semantic document retrieval |
| 🤖 LLM | Google Gemini | Interview generation, evaluation and AI workflows |
| 🔗 AI Framework | LangChain | Prompting, structured output, embeddings and RAG components |
| 🔐 Authentication | JWT + bcrypt | Stateless authentication and password protection |
| 🛡️ Security | Helmet + CORS + Rate Limiting | API protection and controlled access |
| 📄 Documents | pdf-parse | PDF text extraction |
| ✅ Validation | Zod | Request validation and structured data |
| 🚀 Frontend Deployment | Vercel | Fast frontend deployment |
| ☁️ Backend Deployment | Render | Node.js API deployment |

---

# 🧭 Application Journey

The whole platform can be understood as one journey.

```text
Register
   ↓
Login
   ↓
Dashboard
   ↓
Choose what you want to practice
   ↓
Start Interview
   ↓
AI asks question
   ↓
Candidate answers
   ↓
AI evaluates
   ↓
Follow-up or next question
   ↓
Interview completes
   ↓
AI generates final report
   ↓
Candidate reviews performance
```

But the journey does not end there.

The candidate can move into Code Review.

They can explore interview experiences.

They can add their own experiences.

They can prepare their personal knowledge base.

And they can return for another interview with a better understanding of where they went wrong.

---

# 🎤 Workflow 1: Starting an AI Interview

Everything starts from the **New Interview** screen.

The candidate chooses:

```text
Interview Type
     ↓
Difficulty
     ↓
Question Count
     ↓
Start Interview
```

The backend receives this configuration and creates the first question using Gemini.

The AI receives the selected interview guide and difficulty.

For example, a DSA interview is guided differently from a Behavioral interview.

A System Design interview needs architecture-oriented thinking.

An AI and GenAI interview needs questions around modern AI concepts.

A Behavioral interview needs a completely different style of interaction.

The generated first question is stored in PostgreSQL as an interviewer message.

The interview now officially begins.

---

# 🧠 Workflow 2: The AI Interview Loop

This is where Interview Forage becomes more interesting.

The candidate submits an answer.

The backend loads the interview history and gives the AI enough recent context to understand what has already happened.

The system then evaluates the answer using a structured schema.

The evaluation contains:

```text
Correctness
Reasoning
Communication
Evidence Quote
Strengths
Gaps
Next Action
```

The evidence quote is also checked against the candidate's actual answer.

That means the evaluation cannot simply invent a quote and pretend the candidate said something.

The score is calculated from the rubric levels.

```text
Correctness
      +
Reasoning
      +
Communication
      ↓
Rubric Score
      ↓
Interview Score
```

This makes the scoring logic predictable and keeps the final score under application control.

---

# 🔁 Workflow 3: Intelligent Follow-Ups

An interview should not feel like:

```text
Question 1
Answer 1
Question 2
Answer 2
Question 3
Answer 3
```

Real interviews are not that predictable.

Interview Forage allows the AI to decide whether the current answer deserves a follow-up.

The flow becomes:

```text
Question
   ↓
Candidate Answer
   ↓
AI Evaluation
   ↓
Strong but incomplete?
   │
   ├── Yes → Follow-Up Question
   │              ↓
   │        Candidate Answer
   │              ↓
   │        Continue Interview
   │
   └── No → Move Forward
```

The system also keeps a limit on follow-ups so that the interview remains controlled and does not get stuck on a single question.

---

# 📊 Workflow 4: Completing the Interview

Once the required questions are completed, Interview Forage moves from interview mode into report mode.

The system gathers the candidate's evaluated answers.

The score is calculated from the stored rubric results.

Gemini then receives the structured performance record and generates a final report.

The report focuses on:

- 📈 Overall performance
- 💪 Strengths
- 📌 Weak areas
- 🧠 Reasoning quality
- 💬 Communication
- 📝 Improvement areas
- 🎯 Practical recommendations

The evaluation is hidden while the interview is active.

That is intentional.

A candidate should experience the interview first.

The feedback comes after the interview, just like it would in a real process.

---

# 💻 Workflow 5: AI Code Review

Interview Forage also has a dedicated code review workflow.

The candidate provides:

```text
Programming Language
       +
Problem Statement
       +
Source Code
```

The backend sends the submission to the Gemini provider with a structured code-review schema.

Gemini then returns a structured review.

The review is stored in PostgreSQL so the candidate can return to it later.

The flow looks like this:

```text
Candidate Code
      ↓
Express API
      ↓
Validation
      ↓
Gemini
      ↓
Structured Code Review
      ↓
Prisma
      ↓
Neon PostgreSQL
      ↓
Review History
```

This makes the code-review feature persistent rather than turning it into a one-time AI response.

---

# 📚 Workflow 6: Interview Experiences

Interview preparation is not only about AI.

Sometimes the best preparation material comes from someone who has already gone through the process.

That is why Interview Forage includes an interview experience library.

A candidate can publish an experience containing the company, role, round, difficulty, questions, preparation approach, overall experience and advice.

Every experience is clearly treated as user-submitted information.

That distinction matters.

The platform does not present a candidate's experience as an officially verified company fact.

The experience library can also be filtered and searched so candidates can find information relevant to their preparation.

---

# 📄 Workflow 7: RAG Knowledge Pipeline

This is where the personal knowledge layer comes into the story.

A candidate may have:

- 📕 Interview notes
- 📘 DSA notes
- 📗 System design material
- 📙 AI and GenAI notes
- 📄 Resume-related material
- 📝 Personal preparation documents

Instead of throwing an entire document into an LLM prompt, Interview Forage processes the material in stages.

```text
Document
   ↓
Text Extraction
   ↓
Text Cleaning
   ↓
Recursive Chunking
   ↓
Gemini Embeddings
   ↓
Vector Storage
   ↓
Neon PostgreSQL + pgvector
   ↓
Semantic Retrieval
   ↓
Relevant Context
   ↓
Gemini
   ↓
Grounded Answer
```

The first stage extracts readable text.

PDF files are processed through the PDF parser while plain text content can be read directly.

The next stage cleans the text.

The cleaned material is then split into smaller semantic chunks using LangChain's recursive text splitter.

Each chunk becomes an embedding through Gemini's embedding model.

Those vectors are stored inside PostgreSQL using the pgvector extension.

The database therefore stores both the normal application data and the candidate's searchable knowledge representation.

---

# 🔎 Workflow 8: Semantic Retrieval

When the candidate asks something against their knowledge base, the question follows the reverse journey.

The query becomes an embedding.

The embedding is compared against stored document vectors.

The most relevant chunks are ranked using cosine similarity.

Only sufficiently relevant chunks are allowed into the final context.

The retrieval layer also keeps ownership boundaries.

A candidate can retrieve only material belonging to that candidate.

The final context is then packed into a controlled character budget before being passed to Gemini.

The AI receives:

```text
Relevant Excerpt 1
Relevant Excerpt 2
Relevant Excerpt 3
       +
Candidate Question
       ↓
Grounded Gemini Response
```

The RAG prompt instructs the model to answer only from the retrieved excerpts and cite the relevant excerpt numbers.

This keeps the knowledge workflow grounded in the candidate's own material.

---

# 🧠 Why RAG Matters Here

The biggest problem with a generic AI interviewer is that the AI knows a lot, but it does not automatically know **what the candidate has studied**.

RAG changes that.

Instead of asking:

> "What do you know about this topic?"

the system can work with:

> "What does my own preparation material say about this topic?"

That creates a much more personal preparation experience.

The candidate is no longer preparing with a generic chatbot.

The candidate is building an AI preparation environment around their own knowledge.

---

# 🗄️ Database Design

The database is designed around the actual journey of a candidate.

```text
User
 │
 ├── Interviews
 │      │
 │      └── Interview Messages
 │
 ├── Code Reviews
 │
 ├── Interview Experiences
 │
 └── Documents
         │
         └── Document Chunks
                 │
                 └── Embeddings
```

### 👤 User

Stores the candidate's identity and authentication information.

### 🎤 Interview

Stores interview type, difficulty, question count, status, score, report and timestamps.

### 💬 InterviewMessage

Stores every interviewer question and candidate answer.

The evaluation metadata lives alongside the candidate response.

### 💻 CodeReview

Stores the submitted language, problem statement, code, review status and AI-generated result.

### 🧪 Experience

Stores community interview experiences and preparation information.

### 📄 Document

Represents a candidate's uploaded knowledge source and its indexing status.

### 🧩 DocumentChunk

Stores the smaller pieces of documents together with their metadata and vector embeddings.

---

# 🔐 Authentication and Security

The platform treats authentication as a first-class part of the architecture.

A candidate registers with an email, name and password.

The password is hashed before storage.

After authentication, the backend issues a JWT.

Protected API routes verify that token before allowing access to private resources.

The application also adds several defensive layers:

- 🔐 bcrypt password hashing
- 🎫 JWT authentication
- 🛡️ Helmet security headers
- 🌐 Controlled CORS origins
- 🚦 Global API rate limiting
- 🤖 Dedicated AI rate limiting
- 🔒 Ownership checks on user resources
- ✅ Zod request validation
- 🧯 Centralized error handling

The backend does not simply trust whatever arrives from the browser.

Requests are validated before reaching the service layer.

---

# 🧱 Backend Structure

The backend is organized around responsibility rather than putting everything into one huge file.

```text
backend/
│
├── prisma/
│   ├── schema.prisma
│   └── migrations/
│
└── src/
    ├── ai/
    │   ├── llm/
    │   ├── prompts.js
    │   └── schemas.js
    │
    ├── config/
    │
    ├── controllers/
    │
    ├── db/
    │
    ├── middlewares/
    │
    ├── rag/
    │   ├── loaders/
    │   ├── chunkers/
    │   ├── embeddings/
    │   ├── pipeline/
    │   ├── prompts/
    │   ├── repositories/
    │   └── retriever/
    │
    ├── repositories/
    ├── routes/
    ├── services/
    ├── utils/
    └── validators.js
```

The controller receives the request.

The service decides what the application should do.

The AI layer handles model interaction.

The repository layer handles persistent data.

The RAG layer handles knowledge ingestion and retrieval.

The utility layer keeps common concerns isolated.

This separation makes the project easier to extend without turning the backend into one large block of code.

---

# 🎨 Frontend Structure

The frontend follows the same philosophy.

```text
frontend/
│
└── src/
    ├── components/
    ├── context/
    ├── hooks/
    ├── lib/
    ├── pages/
    ├── App.jsx
    ├── index.css
    └── main.jsx
```

The application uses React Router to move between the different experiences.

Authentication state is handled through context.

Protected routes make sure authenticated pages are not directly accessible to guests.

The Code Review page is lazy loaded because the Monaco editor is large and does not need to be loaded for every page.

That small optimization keeps the initial application experience lighter.

---

# 🧭 Main Application Routes

The frontend is organized around the candidate's journey.

```text
/
├── Landing
├── Login
├── Register
│
└── Protected Application
    │
    ├── Dashboard
    ├── Interviews
    ├── New Interview
    ├── Interview Session
    ├── Code Review
    ├── Experiences
    ├── New Experience
    └── Experience Detail
```

The dashboard becomes the starting point after authentication.

From there, the candidate can decide what kind of preparation they need today.

---

# 🤖 Gemini AI Layer

All major AI interactions go through a shared Gemini provider.

This gives the application one controlled place for:

- 💬 Chat generation
- 🧾 Structured output
- 🌊 Streaming responses
- 🧠 Document embeddings
- 🔎 Query embeddings
- 🎥 Media understanding

The provider also handles retries and translates provider failures into application-level errors.

AI rate-limit failures are handled separately so the user gets a meaningful response instead of an unexplained server error.

Structured output is used wherever the application needs predictable data.

That is especially important for interview evaluation and code review because the application needs data that it can safely store and reason about.

---

# 🔗 LangChain's Role

LangChain is not used just because it is popular.

It has specific jobs inside Interview Forage.

It helps with:

- 🧩 Prompt templates
- 📝 Structured AI interactions
- ✂️ Recursive document splitting
- 🧠 Gemini embeddings
- 📚 RAG prompt construction
- 🔎 Retrieval-oriented workflows

The application still keeps the business logic in its own service layer.

LangChain handles the AI-oriented building blocks while Interview Forage controls the actual product behavior.

---

# ☁️ Neon PostgreSQL + pgvector

Neon acts as the persistent database layer.

Normal relational data lives there:

```text
Users
Interviews
Messages
Code Reviews
Experiences
Documents
```

The same PostgreSQL environment also supports the vector side of the application through **pgvector**.

That gives the RAG pipeline a natural home for:

```text
Document
   ↓
Chunks
   ↓
Embedding
   ↓
Vector
   ↓
Similarity Search
```

Instead of maintaining a completely separate vector database for the first version of the platform, the application keeps the candidate's relational and semantic data together.

---

# ⭐ Deployment Story

Interview Forage is designed around a simple production deployment model.

```text
                 GitHub
                    │
          ┌─────────┴─────────┐
          │                   │
          ▼                   ▼
       Vercel              Render
     React Frontend      Node API
                              │
                              ▼
                         Neon PostgreSQL
                              │
                              ▼
                          pgvector
                              │
                              ▼
                        Gemini API
```

The frontend is built with Vite and deployed on Vercel.

The backend runs as a Node.js service on Render.

The backend connects to Neon PostgreSQL.

Prisma migrations are deployed during the backend build process.

Gemini provides the AI intelligence layer.

This keeps the deployment architecture straightforward while still giving the project a real production-style separation between frontend, backend, database and AI services.

---

# ⚙️ Getting Started

Before starting, make sure the following are available:

```text
Node.js
npm
PostgreSQL / Neon
Gemini API key
```

## 1️⃣ Clone the repository

```bash
git clone <your-repository-url>
cd interview-forage
```

The repository contains both the frontend and backend, so the project can be developed as one full-stack application.

---

## 2️⃣ Start the Backend

```bash
cd backend
npm install
```

Create the environment file:

```env
DATABASE_URL="your-neon-database-url"
DIRECT_URL="your-direct-database-url"

JWT_SECRET="your-jwt-secret"

GEMINI_API_KEY="your-gemini-api-key"
GEMINI_MODEL="gemini-2.5-flash"
GEMINI_EMBEDDING_MODEL="gemini-embedding-001"

FRONTEND_URL="http://localhost:5173"
```

Then generate Prisma Client:

```bash
npx prisma generate
```

Apply the database migration:

```bash
npx prisma migrate dev
```

Start the backend:

```bash
npm run dev
```

The API exposes a health endpoint at:

```text
/api/health
```

---

# 🎨 Start the Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Vite will start the React application locally.

The frontend then communicates with the Express API through Axios.

---

# 🧪 Testing the Backend

The backend includes automated tests using Node's native test runner.

Run:

```bash
npm test
```

This gives the application a basic safety net around important utility behavior and keeps the backend easier to evolve.

---

# 📦 Production Build

For the frontend:

```bash
npm run build
```

For the backend deployment, the production flow runs Prisma migration deployment before starting the Node server.

```text
Install dependencies
       ↓
Prisma Client generation
       ↓
Prisma migrations
       ↓
Start Express server
       ↓
Health check
       ↓
Production API
```

---

# 🌟 What Makes Interview Forage Different

A lot of interview platforms stop at questions.

Interview Forage tries to cover the entire preparation loop.

```text
Learn
  ↓
Practice
  ↓
Get Challenged
  ↓
Get Evaluated
  ↓
Understand Weaknesses
  ↓
Review Code
  ↓
Learn From Experiences
  ↓
Use Personal Notes
  ↓
Practice Again
```

That loop is the real product.

The AI interviewer gives pressure.

The evaluation gives feedback.

The code review gives technical depth.

The experience library gives real-world context.

The RAG layer gives personal knowledge.

The dashboard brings everything back together.

---

# 🧩 Design Philosophy

The project follows a few simple principles.

### 🎯 Keep the candidate at the center

Every feature exists because it helps the candidate prepare better.

### 🧠 Use AI where reasoning matters

Gemini is used for interviews, evaluations, reports, code review, embeddings and knowledge retrieval.

### 🗄️ Keep application state reliable

Important interview and evaluation data is persisted through Prisma and PostgreSQL.

### 🔐 Never trust the client blindly

Authentication, validation, ownership checks and rate limits are handled on the backend.

### 📚 Ground AI responses when personal knowledge matters

The RAG pipeline gives the model relevant candidate-owned context instead of forcing every answer to depend only on general model knowledge.

### 🧱 Keep responsibilities separated

React handles the experience.

Express handles the API.

Services handle business logic.

Prisma handles database access.

Gemini handles intelligence.

RAG handles knowledge retrieval.

Neon provides the persistence layer.

---

# 📈 Future Possibilities

Interview Forage already creates a strong foundation, but the architecture leaves room for the product to grow.

Possible next steps include:

- 🎙️ Voice-based mock interviews
- 📹 Video interview analysis
- 🧑‍💼 Role-specific interview tracks
- 🏢 Company-specific preparation paths
- 📊 Advanced performance analytics
- 🧠 Adaptive difficulty
- 🔎 More advanced RAG filters
- 📚 Larger personal knowledge bases
- 📝 Resume-aware interview generation
- 🎯 Personalized preparation plans
- 🧩 Topic-level weakness detection
- 🏆 Interview streaks and progress tracking

The important part is that these features can grow on top of the existing architecture rather than requiring the whole project to be rebuilt.

---

# 🏁 Final Word

Interview Forage started from a very simple thought:

> **Solving interview questions is not the same as being ready for an interview.**

Being interview-ready means thinking under pressure.

It means explaining your approach.

It means handling follow-ups.

It means writing clean code.

It means understanding where your reasoning breaks.

It means learning from people who have already gone through the process.

And it means having your own preparation material available when you need it.

That is what Interview Forage tries to bring together.

**React creates the experience.** 🎨

**Node.js and Express run the application.** 🟢

**Prisma connects the business logic to PostgreSQL.** 🗄️

**Neon keeps the data available.** ☁️

**pgvector gives the platform semantic memory.** 🧠

**LangChain connects the AI building blocks.** 🔗

**Gemini becomes the interviewer, evaluator, reviewer and reasoning engine.** 🤖

**RAG turns the candidate's own documents into searchable knowledge.** 📚

And the candidate gets one place where preparation feels less like collecting questions and more like actually getting ready for the room.

---

## 👨‍💻 Built With

**React • Tailwind CSS • Vite • Node.js • Express.js • Prisma • PostgreSQL • Neon • pgvector • Gemini • LangChain • JWT • Zod • Vercel • Render**

### ⭐ If Interview Forage helps you prepare, consider giving the repository a star.
