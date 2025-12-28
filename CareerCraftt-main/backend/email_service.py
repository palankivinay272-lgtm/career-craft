import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import logging

# CONFIGURATION
# ⚠️ REPLACE THIS WITH YOUR APP PASSWORD
# GOOGLE ACCOUNT -> SECURITY -> 2-STEP VERIFICATION -> APP PASSWORDS
SENDER_EMAIL = "CareerCraft.com@gmail.com"
APP_PASSWORD = "exfl lfhr nltw smym" 

def send_email(to_email, subject, body):
    """
    Sends an email using Gmail SMTP.
    """
    if "PUT_YOUR_APP_PASSWORD_HERE" in APP_PASSWORD:
        logging.warning("⚠️ Email not sent: App Password not configured in email_service.py")
        return False

    try:
        msg = MIMEMultipart()
        msg['From'] = SENDER_EMAIL
        msg['To'] = to_email
        msg['Subject'] = subject

        msg.attach(MIMEText(body, 'plain'))

        # Connect to Gmail SMTP Server
        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()
        server.login(SENDER_EMAIL, APP_PASSWORD)
        text = msg.as_string()
        server.sendmail(SENDER_EMAIL, to_email, text)
        server.quit()
        
        logging.info(f"✅ Email sent to {to_email}")
        return True
    except Exception as e:
        logging.error(f"❌ Failed to send email: {e}")
        return False
