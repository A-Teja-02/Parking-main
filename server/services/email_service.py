"""
Modular email service for OTP delivery.
- DEV_MODE: prints OTP to console and returns it for API response.
- PRODUCTION: sends OTP via SMTP.
"""
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import Optional

from config import settings


def send_otp_email(email: str, otp: str, purpose: str) -> Optional[str]:
    """
    Send an OTP to the given email address.

    Args:
        email: Recipient email address.
        otp: The 6-digit OTP code.
        purpose: 'activation' or 'password_reset'.

    Returns:
        The OTP string in DEV_MODE (so the API can include it in response).
        None in production mode (OTP is sent via email only).
    """
    subject_map = {
        "activation": "Activate Your Quadrant Parking Account",
        "password_reset": "Reset Your Quadrant Parking Password",
    }

    body_map = {
        "activation": f"""
Hello,

Your OTP to activate your Quadrant Parking account is:

    {otp}

This code expires in {settings.OTP_EXPIRE_MINUTES} minutes.

If you did not request this, please contact HR.

— Quadrant IT Services
""",
        "password_reset": f"""
Hello,

Your OTP to reset your Quadrant Parking password is:

    {otp}

This code expires in {settings.OTP_EXPIRE_MINUTES} minutes.

If you did not request this, please ignore this email.

— Quadrant IT Services
""",
    }

    subject = subject_map.get(purpose, "Quadrant Parking OTP")
    body = body_map.get(purpose, f"Your OTP is: {otp}")

    if settings.DEV_MODE:
        print("\n" + "=" * 50)
        print(f"  [DEV] OTP EMAIL — {purpose.upper()}")
        print(f"  To:   {email}")
        print(f"  OTP:  {otp}")
        print("=" * 50 + "\n")
        # Do not return early, so it proceeds to send via SMTP even in dev mode

    # Production: send via SMTP
    if not settings.SMTP_HOST or not settings.SMTP_USER:
        print(f"[WARNING] SMTP not configured. OTP for {email}: {otp}")
        return otp  # Fallback if SMTP not set up yet

    import threading

    def _send_email_async():
        try:
            msg = MIMEMultipart()
            msg["From"] = settings.SMTP_FROM_EMAIL
            msg["To"] = email
            msg["Subject"] = subject
            msg.attach(MIMEText(body, "plain"))

            with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT) as server:
                server.starttls()
                server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
                server.send_message(msg)

            print(f"[EMAIL] OTP sent to {email} ({purpose})")
        except Exception as e:
            print(f"[EMAIL ERROR] Failed to send OTP to {email}: {e}")

    threading.Thread(target=_send_email_async).start()
    return None  # Don't return OTP in production
