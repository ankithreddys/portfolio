# Ankith Portfolio + RAG Chatbot

A personal portfolio website with a built-in RAG chatbot and contact form. The frontend is a React + Vite single-page app, and the backend is a FastAPI service that powers chat and email delivery.

## Features

- Portfolio sections: hero, about, projects, skills, leadership, blogs, and contact
- RAG chatbot widget ("Prompt-to-Ankith") with session memory
- LiveKit voice mode that shares the same RAG brain as text chat
- Contact form that delivers emails via SMTP
- Local document ingestion for the chatbot knowledge base
- Resume file served from `frontend/public/ANKITH SUBHANPURAM.pdf`

## Tech Stack

- Frontend: React, Vite, React Router
- Backend: FastAPI, LangChain, LangGraph, ChromaDB, LiveKit Agents
- AI: OpenAI-compatible chat, embeddings, STT, and TTS

## Project Structure

```
.
├─ frontend/               # React + Vite portfolio app
│  ├─ public/              # Static assets (resume, demos, icons)
│  ├─ src/                 # React source
│  ├─ package.json
│  └─ vercel.json
└─ backend/                # FastAPI RAG + contact email API
   ├─ app/
   ├─ data/docs/           # Source docs for ingestion
   └─ scripts/ingest.py    # Builds Chroma index
```

## Getting Started

### 1) Frontend

```bash
cd frontend
npm install
npm run dev
```

The app runs at `http://localhost:5173`.

### 2) Backend (RAG + contact API + LiveKit agent)

Create and activate a virtual environment (Windows PowerShell):

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

Create `backend/.env` (copy from `backend/.env.example`) and set values.

Run ingestion and start the API:

```bash
python scripts/ingest.py
uvicorn app.main:app --reload --port 8000
```

The API runs at `http://localhost:8000` with a health check at `/api/health`.

If you also want the voice agent locally, run the LiveKit worker in a second terminal:

```bash
python scripts/livekit_agent.py
```

### 3) Frontend API Base URL (optional)

The frontend defaults to `http://localhost:8000`. To override:

```env
VITE_API_BASE_URL=http://localhost:8000
```

Create this in `frontend/.env` (or your shell environment).

## Environment Variables

The backend reads from `backend/.env`. Key variables:

```env
OPENAI_API_KEY=your-key
OPENAI_CHAT_API_KEY=your-chat-key
OPENAI_EMBEDDING_API_KEY=your-embedding-key
OPENAI_BASE_URL=https://api.openai.com/v1
OPENAI_CHAT_BASE_URL=https://api.ai.it.ufl.edu
OPENAI_EMBEDDING_BASE_URL=https://api.ai.it.ufl.edu
OPENAI_MODEL=gpt-oss-20b
OPENAI_EMBEDDING_MODEL=sfr-embedding-mistral
NAVIGATOR_BASE_URL=https://api.ai.it.ufl.edu
NAVIGATOR_API_KEY=your-navigator-api-key
NAVIGATOR_STT_MODEL=whisper-large-v3
NAVIGATOR_LLM_MODEL=gpt-oss-120b
NAVIGATOR_TTS_MODEL=kokoro
NAVIGATOR_TTS_VOICE=af_heart
NAVIGATOR_TTS_SAMPLE_RATE=24000
LIVEKIT_URL=wss://your-project.livekit.cloud
LIVEKIT_API_KEY=your-livekit-api-key
LIVEKIT_API_SECRET=your-livekit-api-secret
LIVEKIT_AGENT_NAME=portfolio-agent
LIVEKIT_ENABLE_AGENT=true
RAG_ENABLE_LLM_RERANKER=false
RAG_LLM_RERANKER_MODEL=
RAG_LLM_RERANKER_TOP_K=6
RAG_FINAL_TOP_K=4
SESSION_MAX_ENTRIES=1000
CHAT_RATE_LIMIT_MAX=12
CHAT_RATE_LIMIT_WINDOW_SECONDS=60
CONTACT_RATE_LIMIT_MAX=3
CONTACT_RATE_LIMIT_WINDOW_SECONDS=3600
CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
CONTACT_RECIPIENT=you@example.com
```

Notes:
- `OPENAI_CHAT_API_KEY` and `OPENAI_EMBEDDING_API_KEY` can be omitted if `OPENAI_API_KEY` is set.
- `NAVIGATOR_API_KEY` is used by the LiveKit agent and can also serve as the shared API key for the OpenAI-compatible backend calls.
- The backend autostarts the LiveKit voice worker when LiveKit credentials are present and `LIVEKIT_ENABLE_AGENT=true`.
- `CONTACT_RECIPIENT` defaults to `SMTP_USER` if not set.

## Chatbot Data

Add or update documents in `backend/data/docs/`, then re-run:

```bash
python scripts/ingest.py
```

This builds the Chroma index used by the chatbot.

### Voice mode

The frontend can request a LiveKit room token from the backend and connect to the voice assistant using the same session ID as the text chat. The LiveKit worker transcribes speech with UF Navigator STT, reuses the shared RAG pipeline for answers, and speaks back with the custom Kokoro TTS adapter.

### Railway deployment

The backend includes `backend/railway.toml` so Railway can run the indexing step and then start the API in one container process:

```toml
[deploy]
startCommand = "python scripts/ingest.py && uvicorn app.main:app --host 0.0.0.0 --port $PORT"
```

When deploying the backend as a Railway monorepo service, set the service root directory to `/backend`.

## Build

```bash
cd frontend
npm run build
npm run preview
```
