from __future__ import annotations

import logging
import smtplib
import socket
from email.message import EmailMessage

from app.config import get_settings

logger = logging.getLogger(__name__)


def _mask_email(value: str) -> str:
  if "@" not in value:
    return value
  local, domain = value.split("@", 1)
  if len(local) <= 2:
    masked_local = "*" * len(local)
  else:
    masked_local = f"{local[0]}***{local[-1]}"
  return f"{masked_local}@{domain}"


def send_contact_email(name: str, email: str, message: str) -> None:
  settings = get_settings()
  if not settings.smtp_user or not settings.smtp_password:
    raise RuntimeError("SMTP credentials are not configured.")

  recipient = settings.resolved_contact_recipient
  if not recipient:
    raise RuntimeError("CONTACT_RECIPIENT is not configured.")

  subject = f"Portfolio contact from {name}"
  body = (
    f"Name: {name}\n"
    f"Email: {email}\n\n"
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
    _mask_email(settings.smtp_user),
    _mask_email(recipient),
    _mask_email(email),
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
    raise RuntimeError(f"SMTP authentication failed: {exc}") from exc
  except smtplib.SMTPConnectError as exc:
    logger.exception("SMTP connect error")
    raise RuntimeError(f"SMTP connect error: {exc}") from exc
  except (smtplib.SMTPServerDisconnected, socket.timeout, TimeoutError, OSError) as exc:
    logger.exception("SMTP connection/timing failure")
    raise RuntimeError(f"SMTP connection/timing failure: {exc}") from exc
  except smtplib.SMTPException as exc:
    logger.exception("SMTP protocol failure")
    raise RuntimeError(f"SMTP protocol failure: {exc}") from exc

  logger.info("SMTP send completed successfully")
