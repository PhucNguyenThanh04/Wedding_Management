from fastapi_mail import FastMail, MessageSchema
from src.core.config import setting

def send_email(to: str, subject: str, body: str):
    message = MessageSchema(
        recipients=[to],
        subject=subject,
        body=body,
        subtype="plain"
    )

    fm = FastMail(setting.EMAIL_CONFIG)
    fm.send_message(message)