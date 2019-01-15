import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

from email.message import EmailMessage



class EmailSystem:
    SYSTEM_LINK = "http://gamecore.itcarlow.ie/CodeReviewer2/"



    def __init__(self):
        print("EmailSystem: __init__")
        self.email_server = 'akmac.itcarlow.ie'
        self.EMAIL_ADDRESS = 'mihapelko93@gmail.com'

        self.letter_welcome_gamified = "Welcome, {0} {1}.br>This email will shortly explain to you what you should do in a step-to-step guide.<br>1) When you are in the system, press the Challenge button and complete one set of challenges.  Use this opportunity to explore how to work with it. <br>2) Upon completion of the challenge chain, you should visit the Profile Page and explore it's content.  There you can track your progress in learning the standards.<br>3) Well done!  Now you are ready to use it on daily basis for as long as you want to.  It will grow on weekly basis, adding new things to learn and challenges.<br><br>Good luck!"

        self.letter_welcome_non_gamified = "Welcome, {0} {1}.<br>This email will shortly explain to you what you should do in a step-to-step guide.<br>1) When you are in the system, press the Training button and complete one training session.  Use this opportunity to explore how to work with it. <br>2) Well done!  Now you are ready to use it on daily basis for as long as you want to.  It will grow on weekly basis, adding new things to learn and training exercises.<br><br>Good luck!"

        self.letter_challenge_error = "Hello, <br> The student named {0} {1} have found an error in the challenge.  There is the report: <br> Challenge ID: {2} <br> Message: {3}"







    def send_gamification_email(self, student):
        msg = MIMEMultipart()
        msg['From'] = self.EMAIL_ADDRESS
        msg['To'] = student["email"]
        msg['Subject'] = "Welcome to the Challenge System"

        content = self.letter_welcome_gamified.format(student["name"], student["surname"])
        msg.attach(MIMEText(content, 'html'))

        try:
            s = smtplib.SMTP(self.email_server)
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
            s = smtplib.SMTP(self.email_server)
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

        #try:
        s = smtplib.SMTP(self.email_server)
        s.sendmail(self.EMAIL_ADDRESS, teacher_email, msg.as_string())
        s.quit()

        #except IOError:
        #    print("Error sending 'send_error_report' email: Unable to send to " + teacher_email)
        #except smtplib.SMTPConnectError:
        #   print("Error sending 'send_error_report' email: smtp exception " + teacher_email)




    def __del__(self, *err):
        print ("EmailSystem:__del__")