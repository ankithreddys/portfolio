from __future__ import annotations

import logging
import smtplib
import socket
from email.message import EmailMessage

from app.config import get_settings
from app.services.security import mask_email

logger = logging.getLogger(__name__)


def _sanitize_header_value(value: str, fallback: str = "") -> str:
  sanitized = (value or "").replace("\r", " ").replace("\n", " ").strip()
  return sanitized or fallback


def send_contact_email(name: str, email: str, message: str) -> None:
  settings = get_settings()
  if not settings.smtp_user or not settings.smtp_password:
    raise RuntimeError("SMTP credentials are not configured.")

  recipient = settings.resolved_contact_recipient
  if not recipient:
    raise RuntimeError("CONTACT_RECIPIENT is not configured.")

  safe_name = _sanitize_header_value(name, "anonymous")
  safe_email = _sanitize_header_value(email, "unknown")
  subject = f"Portfolio contact from {safe_name}"
  body = (
    f"Name: {safe_name}\n"
    f"Email: {safe_email}\n\n"
    f"Message:\n{message}\n"
  )

  msg = EmailMessage()
  msg["From"] = settings.smtp_user
  msg["To"] = recipient
  msg["Subject"] = subject
  msg.set_content(body)

  logger.info(
    "SMTP send start: host=%s port=%s smtp_user=%s recipient=%s sender_email=%s",
    settings.smtp_host,
    settings.smtp_port,
    mask_email(settings.smtp_user),
    mask_email(recipient),
    mask_email(safe_email),
  )

  try:
    if settings.smtp_port == 465:
      logger.info("Opening SMTP SSL connection")
      with smtplib.SMTP_SSL(settings.smtp_host, settings.smtp_port, timeout=20) as server:
        logger.info("SMTP SSL connection established, attempting login")
        server.login(settings.smtp_user, settings.smtp_password)
        logger.info("SMTP login successful, sending message")
        server.send_message(msg)
    else:
      logger.info("Opening SMTP connection")
      with smtplib.SMTP(settings.smtp_host, settings.smtp_port, timeout=20) as server:
        logger.info("SMTP connection established, starting TLS")
        server.ehlo()
        server.starttls()
        server.ehlo()
        logger.info("TLS started, attempting login")
        server.login(settings.smtp_user, settings.smtp_password)
        logger.info("SMTP login successful, sending message")
        server.send_message(msg)
  except smtplib.SMTPAuthenticationError as exc:
    logger.exception("SMTP authentication failed")
    raise RuntimeError("SMTP authentication failed.") from exc
  except smtplib.SMTPConnectError as exc:
    logger.exception("SMTP connect error")
    raise RuntimeError("SMTP connect error.") from exc
  except (smtplib.SMTPServerDisconnected, socket.timeout, TimeoutError, OSError) as exc:
    logger.exception("SMTP connection/timing failure")
    raise RuntimeError("SMTP connection/timing failure.") from exc
  except smtplib.SMTPException as exc:
    logger.exception("SMTP protocol failure")
    raise RuntimeError("SMTP protocol failure.") from exc

  logger.info("SMTP send completed successfully")
