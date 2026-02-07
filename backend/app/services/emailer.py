from __future__ import annotations

import smtplib
from email.message import EmailMessage

from app.config import get_settings


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

  if settings.smtp_port == 465:
    with smtplib.SMTP_SSL(settings.smtp_host, settings.smtp_port) as server:
      server.login(settings.smtp_user, settings.smtp_password)
      server.send_message(msg)
  else:
    with smtplib.SMTP(settings.smtp_host, settings.smtp_port) as server:
      server.starttls()
      server.login(settings.smtp_user, settings.smtp_password)
      server.send_message(msg)
