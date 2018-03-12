from database_manager import DatabaseManager
from email_system import EmailSystem
from bs4 import BeautifulSoup
import requests
import random
import json



class AssignmentsManager:
	def __init__(self):
		print("AssignmentsManager: __init__")
		self.database_manager = DatabaseManager()
		self.email_system = EmailSystem()


	def add_assignment(self, message_data):
		print("add_assignment")
		type = "teacher_assignments_creation_successful"
		data = {}

		try:
			pass
			self.database_manager.insert_into_table("Assignments", message_data)
			print("Added Assignment Successfully")
		except:
			type = "teacher_assignments_creation_failed"
			print("Added Assignment Failed")

		message = [type, data]
		return message

	def delete_assignment(self, id):
		type = "assignment_delete_successful"
		data = {}

		try:
			pass
			self.database_manager.delete_assignment(id)
			print("Deleted Assignment Successfully")
		except:
			type = "assignment_delete_failed"
			print("Deleted Assignment Failed")

		message = [type, data]
		return message


	def get_assignments(self):
		print("get_assignment")
		type = "get_assignments_successful"
		data = {}

		try:
			data = self.database_manager.select_all_from_table("Assignments")
			print("Retrieved Assignments Successfully")
		except:
			type = "get_assignments_failed"
			print("Added Assignment Failed")

		message = [type, data]
		return message


	def submit_assignment(self, message_data):
		print("submit_assignment")
		type = "submit_assignment_successful"
		data = []

		try:

			submission_data = json.dumps(message_data["submission_data"])
			message_data["submission_data"] = submission_data

			reviewers_ids = json.dumps(message_data["reviewers_ids"])
			message_data["reviewers_ids"] = reviewers_ids

			feedbacks = json.dumps(message_data["feedbacks"])
			message_data["feedbacks"] = feedbacks

			self.database_manager.replace_into_table("Submissions", message_data)
			print("Submitted Assignment Successfully")

		except:
			type = "submit_assignment_failed"
			print("Submitted Assignment Failed")

		message = [type, data]
		return message

	def get_submissions(self, user_id):
		print("get_submissions")
		type = "get_submissions_successful"
		data = []

		#try:
		submissions = self.database_manager.select_all_from_table("Submissions")
		users = self.database_manager.select_all_from_table("Users")

		# these include a.Personal submissions and b.Submission to review.
		actual_submissions = []

		for submission in submissions:

			#if it is our submission - we grab it
			if submission["user_id"] == user_id:
				actual_submissions.append(submission)

			submission_data = json.loads(submission["submission_data"])
			submission["submission_data"] = submission_data

			reviewers_ids = json.loads(submission["reviewers_ids"])

			if len(reviewers_ids) > 0:
				for i in range(0, len(reviewers_ids)):
					for user in users:
						if user["id"] == reviewers_ids[i]:
							reviewers_ids[i] = user

					# if user requesting submissions is mentioned as a reviewer - we grab the submission
					if reviewers_ids[i]["id"] == user_id:
						actual_submissions.append(submission)


			submission["reviewers_ids"] = reviewers_ids

			feedbacks = json.loads(submission["feedbacks"])
			submission["feedbacks"] = feedbacks




		data = actual_submissions

		print("Get Submissions Successfully")
		#except:
		#	type = "get_submissions_failed"
		#	print("Get Submissions Failed")

		message = [type, data]
		return message

	def get_all_submissions(self):
		print("get_all_submissions")
		type = "get_submissions_successful"
		data = []

		try:
			submissions = self.database_manager.select_all_from_table("Submissions")
			users = self.database_manager.select_all_from_table("Users")

			for submission in submissions:
				submission_data = json.loads(submission["submission_data"])
				submission["submission_data"] = submission_data

				reviewers_ids = json.loads(submission["reviewers_ids"])

				if len(reviewers_ids) > 0:
					for i in range(0, len(reviewers_ids)):
						for user in users:
							if user["id"] == reviewers_ids[i]:
								reviewers_ids[i] = user
				submission["reviewers_ids"] = reviewers_ids


				feedbacks = json.loads(submission["feedbacks"])
				submission["feedbacks"] = feedbacks



				for user in users:
					if user["id"] == submission["user_id"]:
						submission["user_data"] = user

			data = submissions

			print("Get All Submissions Successfully")
		except:
			type = "get_submissions_failed"
			print("Get all Submissions Failed")

		message = [type, data]
		return message



	def get_submissions_for_assignment(self,assignment_id):
		all_submissions = self.get_all_submissions()[1]
		submissions = []
		for submission in all_submissions:
			if submission["assignment_id"] == assignment_id:
				submissions.append(submission)

		return submissions



	def submit_review(self, message_data):
		print("submit_review")
		type = "submit_review_successful"

		new_review = message_data["new_review"]
		del message_data["new_review"]

		data = []

		try:
			if new_review:
				self.database_manager.add_review(message_data)
				print("Submitted New Review Successfully")
			else:
				self.database_manager.update_review(message_data)
				print("Submitted Updated Review Successfully")

		except:
			type = "submit_review_failed"
			print("Submit Review Failed")

		message = [type, data]
		return message


	def push_standard(self, message_data):
		print("push_standard")
		type = "submit_review_successful"
		data = {}

		skip_title_h1 = True

		html_content = message_data["html_content"]
		soup = BeautifulSoup(html_content, 'html.parser')
		node_list = soup.find_all(["h1", "h2"])

		standards = []
		standard_bit = {}

		for n in node_list:
			if n.get_text() == "":
				continue

			if n.name == "h1":
				if skip_title_h1:
					skip_title_h1 = False
					continue
				standard_bit["category"] = n.get_text().rstrip()

			if n.name == "h2":
				standard_bit["sub_category"] = n.get_text().rstrip()
				standard_bit["description"] = ""
				for elem in n.next_siblings:
					if elem.name == 'p':
						if elem.get_text() != "":
							description = elem.get_text()
							description.replace("┬а", " ")
							standard_bit["description"] += description + "<br>"

					if elem.name and elem.name.startswith('h'):
						category = standard_bit["category"]
						standards.append(standard_bit)
						standard_bit = {"category":category}
						break

		try:
			for standard in standards:
				self.database_manager.replace_into_table("Standards", standard)
			print("Submitted Standard Successfully")


		except:
			type = "submit_review_failed"
			pass

		message = [type, standards]
		return message

	def get_standard(self):
		print("get_standard")
		type = "get_standard_successful"
		data = []

		try:
			data = self.database_manager.select_all_from_table("Standards")
			print("Get All Standards Successfully")
		except:
			type = "get_standard_failed"
			print("Get All Standards Failed")

		message = [type, data]
		return message
