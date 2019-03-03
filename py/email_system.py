import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

from email.message import EmailMessage



class EmailSystem:
    SYSTEM_LINK = "http://gamecore.itcarlow.ie/CodeReviewer2/"



    def __init__(self):
        print("EmailSystem: __init__")
        self.email_server = 'smtp.gmail.com'
        self.email_server_port = 465
        self.EMAIL_ADDRESS = 'mihakonotest@gmail.com'
        self.EMAIL_PASSWORD = "itcarlowtestpass123"

        self.letter_welcome_gamified = "Welcome, {0} {1}.<br>This email will shortly explain to you what you should do in a step-to-step guide.<br>1) When you are in the system, press the Challenge button and complete one set of challenges.  Use this opportunity to explore how to work with it. <br>2) Upon completion of the challenge chain, you should visit the Profile Page and explore it's content.  There you can track your progress in learning the standards.<br>3) Well done!  Now you are ready to use it on daily basis for as long as you want to.<br><br>Good luck!"

        self.letter_welcome_non_gamified = "Welcome, {0} {1}.<br>This email will shortly explain to you what you should do in a step-to-step guide.<br>1) When you are in the system, press the Training button and complete one training session.  Use this opportunity to explore how to work with it. <br>2) Well done!  Now you are ready to use it on daily basis for as long as you want to.<br><br>Good luck!"

        self.letter_challenge_error = "Hello, <br> The student named {0} {1} have found an error in the challenge.  There is the report: <br> Challenge ID: {2} <br> Message: {3}"

        self.letter_signin_error = "Hello, <br> The student with email {0} reported a following issue when signing in: {1}"

        self.letter_signin_forgot_password = "Hello, <br> The CodeReviewer system detected that you have forgotten your password for the system.  System generated a temporary password for you, which we advise you to change to one of your liking.<br><br>{0}<br><br>Have a good day!"



    def send_signin_forgot_password(self, email, new_password):
        msg = MIMEMultipart()
        msg['From'] = self.EMAIL_ADDRESS
        msg['To'] = email
        msg['Subject'] = "Forgot Password"

        content = self.letter_signin_forgot_password.format(new_password)

        print ("From:", msg['From'])
        print ("To:", msg['To'])
        print ("Subject:", msg['Subject'])
        print ("content:", content)

        msg.attach(MIMEText(content, 'html'))

        try:
            s = smtplib.SMTP_SSL(self.email_server, self.email_server_port)
            s.login(self.EMAIL_ADDRESS, self.EMAIL_PASSWORD)
            s.sendmail(self.EMAIL_ADDRESS, email, msg.as_string())
            s.quit()

        except IOError:
            print("Error sending 'send_signin_forgot_password' email: Unable to send to c00157576@itcarlow.ie")
        except smtplib.SMTPConnectError:
           print("Error sending 'send_signin_forgot_password' email: smtp exception c00157576@itcarlow.ie")

    def send_signin_issue_report(self, data):
        msg = MIMEMultipart()
        msg['From'] = self.EMAIL_ADDRESS
        msg['To'] = "c00157576@itcarlow.ie"
        msg['Subject'] = "Sign In Error Report"

        content = self.letter_signin_error.format(
            data["email"],
            data["issue"])


        print ("From:", msg['From'])
        print ("To:", msg['To'])
        print ("Subject:", msg['Subject'])
        print ("content:", content)

        msg.attach(MIMEText(content, 'html'))

        try:
            s = smtplib.SMTP_SSL(self.email_server, self.email_server_port)
            s.login(self.EMAIL_ADDRESS, self.EMAIL_PASSWORD)
            s.sendmail(self.EMAIL_ADDRESS, "c00157576@itcarlow.ie", msg.as_string())
            s.quit()

        except IOError:
            print("Error sending 'send_signin_issue_report' email: Unable to send to c00157576@itcarlow.ie")
        except smtplib.SMTPConnectError:
           print("Error sending 'send_signin_issue_report' email: smtp exception c00157576@itcarlow.ie")






    def send_gamification_email(self, student):
        msg = MIMEMultipart()
        msg['From'] = self.EMAIL_ADDRESS
        msg['To'] = student["email"]
        msg['Subject'] = "Welcome to the Challenge System"

        content = self.letter_welcome_gamified.format(student["name"], student["surname"])
        msg.attach(MIMEText(content, 'html'))

        try:
            s = smtplib.SMTP_SSL(self.email_server, self.email_server_port)
            s.login(self.EMAIL_ADDRESS, self.EMAIL_PASSWORD)
            s.sendmail(self.EMAIL_ADDRESS, student["email"], msg.as_string())
            s.quit()

        except IOError:
            print("Error sending 'send_gamification_email' email: Unable to send to " + student["email"])
        except smtplib.SMTPConnectError:
            print("Error sending 'send_gamification_email' email: smtp exception " + student["email"])


    def send_non_gamification_email(self, student):
        msg = MIMEMultipart()
        msg['From'] = self.EMAIL_ADDRESS
        msg['To'] = student["email"]
        msg['Subject'] = "Welcome to the Training System"

        content = self.letter_welcome_non_gamified.format(student["name"], student["surname"])
        msg.attach(MIMEText(content, 'html'))

        try:
            s = smtplib.SMTP_SSL(self.email_server, self.email_server_port)
            s.login(self.EMAIL_ADDRESS, self.EMAIL_PASSWORD)
            s.sendmail(self.EMAIL_ADDRESS, student["email"], msg.as_string())
            s.quit()

        except IOError:
            print("Error sending 'send_non_gamification_email' email: Unable to send to " + student["email"])
        except smtplib.SMTPConnectError:
            print("Error sending 'send_non_gamification_email' email: smtp exception " + student["email"])


    def send_error_report(self, teacher_email, data):
        msg = MIMEMultipart()
        msg['From'] = self.EMAIL_ADDRESS
        msg['To'] = teacher_email
        msg['Subject'] = "Challenge Error Report"

        content = self.letter_challenge_error.format(
            data["reporter_name"],
            data["reporter_surname"],
            data["challenge_id"],
            data["text"])

        print ("From:", msg['From'])
        print ("To:", msg['To'])
        print ("Subject:", msg['Subject'])
        print ("content:", content)

        msg.attach(MIMEText(content, 'html'))

        try:
            s = smtplib.SMTP_SSL(self.email_server, self.email_server_port)
            s.login(self.EMAIL_ADDRESS, self.EMAIL_PASSWORD)
            s.sendmail(self.EMAIL_ADDRESS, teacher_email, msg.as_string())
            s.quit()

        except IOError:
            print("Error sending 'send_error_report' email: Unable to send to " + teacher_email)
        except smtplib.SMTPConnectError:
           print("Error sending 'send_error_report' email: smtp exception " + teacher_email)




    def __del__(self, *err):
        print ("EmailSystem:__del__")