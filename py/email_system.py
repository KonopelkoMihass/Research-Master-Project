import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

from email.message import EmailMessage

class EmailSystem:
	def __init__(self):
		print("EmailSystem: __init__")
		self.email_server = 'akmac.itcarlow.ie'
		self.from_mail = 'sanaul.haque@itcarlow.ie'

	def send_submission_notification(self, recepient):
		msg = MIMEMultipart()
		msg['From'] = self.from_mail
		msg['To'] = recepient["email"]
		subject = "Week"
		msg['Subject'] = subject
		content = "Hello"
		msg.attach(MIMEText(content, 'html'))

		try:
			s = smtplib.SMTP(self.email_server)
			s.sendmail(self.from_mail, recepient["email"], msg.as_string())
			s.quit()

		except IOError:
			print("Error sending 'send_submission' email: Unable to send to " +  recepient["email"])
		except smtplib.SMTPConnectError:
			print("Error sending 'send_submission' email: smtp exception " +  recepient["email"])