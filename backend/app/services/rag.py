from __future__ import annotations

import logging
from typing import Any, TypedDict

from langchain_core.messages import AIMessage, HumanMessage, SystemMessage
from langchain_openai import ChatOpenAI
from langgraph.graph import StateGraph, END

from app.config import get_settings
from app.services.vectorstore import get_vectorstore


logger = logging.getLogger(__name__)


class RagState(TypedDict):
  question: str
  chat_history: list[dict]
  context: str
  answer: str


def _build_messages(user_message: str, history: list[dict], context: str) -> list:
  system_message = (
    "You are a public-facing chatbot for Ankith Reddy Subhanpuram's portfolio. "
    "Answer questions about Ankith, his projects, skills, research interests, and contact info "
    "using the provided context. Keep responses concise (2-4 sentences). "
    "Respond in plain text only (no markdown, no bullet lists). "
    "If the answer is not in the context, say you do not have that information."
  )
  messages: list[Any] = [SystemMessage(content=system_message)]

  if context:
    messages.append(SystemMessage(content=f"Context:\n{context}"))

  for item in history[-10:]:
    role = item.get("role")
    content = item.get("content", "")
    if role == "assistant":
      messages.append(AIMessage(content=content))
    else:
      messages.append(HumanMessage(content=content))

  messages.append(HumanMessage(content=user_message))
  return messages


def _retrieve(state: RagState) -> RagState:
  retriever = get_vectorstore().as_retriever(search_kwargs={"k": 4})
  docs = retriever.invoke(state["question"])
  context = "\n\n".join([doc.page_content for doc in docs])
  return {**state, "context": context}


def _generate(state: RagState) -> RagState:
  settings = get_settings()
  llm = ChatOpenAI(
    model=settings.openai_model,
    temperature=0.2,
    openai_api_key=settings.chat_api_key,
    openai_api_base=settings.chat_base_url,
  )
  messages = _build_messages(state["question"], state["chat_history"], state["context"])
  response = llm.invoke(messages)
  return {**state, "answer": response.content or ""}


def _build_graph():
  graph = StateGraph(RagState)
  graph.add_node("retrieve", _retrieve)
  graph.add_node("generate", _generate)
  graph.add_edge("retrieve", "generate")
  graph.add_edge("generate", END)
  graph.set_entry_point("retrieve")
  return graph.compile()


_GRAPH = _build_graph()


def generate_reply(user_message: str, history: list[dict]) -> dict | None:
  settings = get_settings()
  if not settings.chat_api_key:
    return {
      "reply": "OPENAI_CHAT_API_KEY is not set. Add it to the backend environment and retry.",
    }
  if not settings.embedding_api_key:
    return {
      "reply": "OPENAI_EMBEDDING_API_KEY is not set. Add it to the backend environment and retry.",
    }

  try:
    result = _GRAPH.invoke(
      {
        "question": user_message,
        "chat_history": history,
        "context": "",
        "answer": "",
      }
    )
  except Exception:
    logger.exception("RAG graph invocation failed")
    return None

  return {"reply": result.get("answer", "")}
