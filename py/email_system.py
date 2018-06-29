import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

from email.message import EmailMessage



class EmailSystem:
	SYSTEM_LINK = "http://gamecore.itcarlow.ie/CodeReviewer2/"



	def __init__(self):
		print("EmailSystem: __init__")
		self.email_server = 'akmac.itcarlow.ie'
		self.EMAIL_ADDRESS = 'c00157576@itcarlow.ie'


		self.letter_near_deadline = "Hello {0}.<br><br>  The deadline for the {1} is at {2} {3}.  Please submit your work. " \
									"<br><br>Have a good day<br>Spaceship Assembly Message System"



		self.letter_review = "Hi there {0}.<br><br>" \
							 "The deadline was successfully completed.  Visit the \"Reviews To Do\" tab and see the submissions you need to review for this assignment.  Periodically check the \"Feedbacks\" tab to see work reviewed.<br><br>" \
							 "If you want to resubmit work, you can do it in your \"Assignments\" tab, but there is a limit up to which time you can do it - once it reached you cannot do any reviews.<br><br>" \
							 "Good luck<br>Spaceship Assembly Message System"



		self.letter_re_submission = "Greetings {0}.<br><br> One of the users whose work you reviewed has submitted a new version of the submission - go take a look at it and fix it if needed.<br><br> Regards<br>Spaceship Assembly Message System"

		self.letter_near_review_deadline = "Hello {0}.<br><br> The deadline for reviewing is coming.  Please complete your reviews if you haven't yet<br><br>Good luck<br>Spaceship Assembly Message System"

		self.letter_welcome = 	"Welcome, {0}.  You were invited into the Spaceship Assembly Sector as a programmer!  Here is the ticket to our place: <a href='{1}'>Ticket</a><br><br>Regards<br>Spaceship Assembly Message System"






	def send_welcome_emails(self, org, students):
		repo_url_part = "https://github.com/" + org + "/"
		for student in students:
			msg = MIMEMultipart()
			msg['From'] = self.EMAIL_ADDRESS
			msg['To'] = student["email"]
			msg['Subject'] = "Welcome to the system"
			full_repo_path = repo_url_part + student["team_repo"] + "/"

			content = 	self.letter_welcome.format(student["full_name"], full_repo_path)
			msg.attach(MIMEText(content, 'html'))

			try:
				s = smtplib.SMTP(self.email_server)
				s.sendmail(self.EMAIL_ADDRESS, student["email"], msg.as_string())
				s.quit()
			except IOError:
				print("Error sending 'send_welcome_emails' email: Unable to send to " + student["email"])
			except smtplib.SMTPConnectError:
				print("Error sending 'send_welcome_emails' email: smtp exception " + student["email"])


	def send_new_deadline_emails(self, students, deadline):
		for student in students:
			msg = MIMEMultipart()
			msg['From'] = self.EMAIL_ADDRESS
			msg['To'] = student["email"]
			msg['Subject'] = "There is a new deadline!"
			deadline_datetime = deadline["datetime"].split("T")

			content = 	self.letter_new_deadline.format(deadline["name"], deadline_datetime[0], deadline_datetime[1], self.CODE_REVIEW_URL, student["full_name"])
			msg.attach(MIMEText(content, 'html'))

			try:
				s = smtplib.SMTP(self.email_server)
				s.sendmail(self.EMAIL_ADDRESS, student["email"], msg.as_string())
				s.quit()
			except IOError:
				print("Error sending 'send_welcome_emails' email: Unable to send to " + student["email"])
			except smtplib.SMTPConnectError:
				print("Error sending 'send_welcome_emails' email: smtp exception " + student["email"])





	def send_near_deadline_emails(self, students, deadline):
		datetime = deadline["date_time"].split("T")
		for student in students:
			msg = MIMEMultipart()
			msg['From'] = self.EMAIL_ADDRESS
			msg['To'] = student["email"]
			msg['Subject'] =  deadline["name"] + "'s deadline is within an hour!"

			content = 	self.letter_near_deadline.format(student["full_name"], deadline["name"], datetime[0],  datetime[1])
			msg.attach(MIMEText(content, 'html'))

			try:
				s = smtplib.SMTP(self.email_server)
				s.sendmail(self.EMAIL_ADDRESS, student["email"], msg.as_string())
				s.quit()
			except IOError:
				print("Error sending 'send_near_deadline_emails' email: Unable to send to " + student["email"])
			except smtplib.SMTPConnectError:
				print("Error sending 'send_near_deadline_emails' email: smtp exception " + student["email"])


	def send_submission_message(self, student):
		msg = MIMEMultipart()
		msg['From'] = self.EMAIL_ADDRESS
		msg['To'] = student["email"]
		msg['Subject'] = "You successfully submitted your work."
		content = self.letter_submission.format(student["full_name"])

		msg.attach(MIMEText(content, 'html'))
		try:
			s = smtplib.SMTP(self.email_server)
			s.sendmail(self.EMAIL_ADDRESS, student["email"], msg.as_string())
			s.quit()

		except IOError:
			print("Error sending 'send_submission' email: Unable to send to " + student["email"])
		except smtplib.SMTPConnectError:
			print("Error sending 'send_submission' email: smtp exception " + student["email"])




	def send_review_email(self, student, pull_url):
		msg = MIMEMultipart()
		msg['From'] = self.EMAIL_ADDRESS
		msg['To'] = student["email"]
		msg['Subject'] = "Deadline is completed!"

		content = 	self.letter_review.format(student["full_name"],pull_url,self.CODE_REVIEW_URL, self.CPP_STANDARDS)

		msg.attach(MIMEText(content, 'html'))
		try:
			s = smtplib.SMTP(self.email_server)
			s.sendmail(self.EMAIL_ADDRESS, student["email"], msg.as_string())
			s.quit()

		except IOError:
			print("Error sending 'send_submission' email: Unable to send to " + student["email"])
		except smtplib.SMTPConnectError:
			print("Error sending 'send_submission' email: smtp exception " + student["email"])




	def send_review_passed_email(self, student, pull_url):
		msg = MIMEMultipart()
		msg['From'] = self.EMAIL_ADDRESS
		msg['To'] = student["email"]
		msg['Subject'] = "Your Pull Request is good to merge!"
		content = 	self.letter_passed.format(student["full_name"], pull_url)

		msg.attach(MIMEText(content, 'html'))
		try:
			s = smtplib.SMTP(self.email_server)
			s.sendmail(self.EMAIL_ADDRESS, student["email"], msg.as_string())
			s.quit()

		except IOError:
			print("Error sending 'send_submission' email: Unable to send to " + student["email"])
		except smtplib.SMTPConnectError:
			print("Error sending 'send_submission' email: smtp exception " + student["email"])







	def send_review_redo_email(self, student, pull_url):
		msg = MIMEMultipart()
		msg['From'] = self.EMAIL_ADDRESS
		msg['To'] = student["email"]
		msg['Subject'] = "Your Repo was reviewed.  Solve issues."
		content = self.letter_redo.format( student["full_name"], pull_url)

		msg.attach(MIMEText(content, 'html'))
		try:
			s = smtplib.SMTP(self.email_server)
			s.sendmail(self.EMAIL_ADDRESS, student["email"], msg.as_string())
			s.quit()

		except IOError:
			print("Error sending 'send_submission' email: Unable to send to " + student["email"])
		except smtplib.SMTPConnectError:
			print("Error sending 'send_submission' email: smtp exception " + student["email"])


	def send_review_corrected_email(self, student, pull_url):
		msg = MIMEMultipart()
		msg['From'] = self.EMAIL_ADDRESS
		msg['To'] = student["email"]
		msg['Subject'] = "Pull Request you reviewed was corrected"

		content = self.letter_corrected.format(pull_url, student["full_name"])

		msg.attach(MIMEText(content, 'html'))

		try:
			s = smtplib.SMTP(self.email_server)
			s.sendmail(self.EMAIL_ADDRESS, student["email"], msg.as_string())
			s.quit()

		except IOError:
			print("Error sending 'send_submission' email: Unable to send to " + student["email"])
		except smtplib.SMTPConnectError:
			print("Error sending 'send_submission' email: smtp exception " + student["email"])



	def __del__(self, *err):
		print ("EmailSystem:__del__")