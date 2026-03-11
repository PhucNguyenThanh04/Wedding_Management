from fastapi_mail import FastMail, MessageSchema, MessageType
from src.core.config import setting


async def send_email(to: str, subject: str, body: str):
    message = MessageSchema(
        recipients=[to],
        subject=subject,
        body=body,
        subtype=MessageType.plain
    )

    fm = FastMail(setting.EMAIL_CONFIG)
    await fm.send_message(message)
