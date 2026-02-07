# Ankith Portfolio + RAG Chatbot

A personal portfolio website with a built-in RAG chatbot and contact form. The frontend is a React + Vite single-page app, and the backend is a FastAPI service that powers chat and email delivery.

## Features

- Portfolio sections: hero, about, projects, skills, and contact
- RAG chatbot widget (“Prompt-to-Ankith”) with session memory
- Contact form that delivers emails via SMTP
- Local document ingestion for the chatbot knowledge base
- Resume file served from `public/resume.pdf`

## Tech Stack

- Frontend: React, Vite, React Router
- Backend: FastAPI, LangChain, LangGraph, ChromaDB
- AI: OpenAI-compatible chat + embeddings

## Project Structure

```
.
├─ backend/                # FastAPI RAG + contact email API
│  ├─ app/
│  ├─ data/docs/           # Source docs for ingestion
│  └─ scripts/ingest.py    # Builds Chroma index
├─ public/                 # Static assets (resume, icons)
└─ src/                    # React app
```

## Getting Started

### 1) Frontend

```
npm install
npm run dev
```

The app runs at `http://localhost:5173`.

### 2) Backend (RAG + contact API)

Create and activate a virtual environment (Windows PowerShell):

```
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

Create `backend/.env` (copy from `backend/.env.example`) and set values.

Run ingestion and start the API:

```
python scripts/ingest.py
uvicorn app.main:app --reload --port 8000
```

The API runs at `http://localhost:8000` with a health check at `/api/health`.

### 3) Frontend API Base URL (optional)

The frontend defaults to `http://localhost:8000`. To override:

```
VITE_API_BASE_URL=http://localhost:8000
```

Create this in a root `.env` file or your shell environment.

## Environment Variables

The backend reads from `backend/.env`. Key variables:

```
OPENAI_API_KEY=your-key
OPENAI_CHAT_API_KEY=your-chat-key
OPENAI_EMBEDDING_API_KEY=your-embedding-key
OPENAI_BASE_URL=https://api.openai.com/v1
OPENAI_CHAT_BASE_URL=https://api.openai.com/v1
OPENAI_EMBEDDING_BASE_URL=https://api.openai.com/v1
OPENAI_MODEL=gpt-4o-mini
OPENAI_EMBEDDING_MODEL=text-embedding-3-small
CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
CONTACT_RECIPIENT=you@example.com
```

Notes:
- `OPENAI_CHAT_API_KEY` and `OPENAI_EMBEDDING_API_KEY` can be omitted if `OPENAI_API_KEY` is set.
- `CONTACT_RECIPIENT` defaults to `SMTP_USER` if not set.

## Chatbot Data

Add or update documents in `backend/data/docs/`, then re-run:

```
python scripts/ingest.py
```

This builds the Chroma index used by the chatbot.

## Build

```
npm run build
npm run preview
```

## License

MIT
