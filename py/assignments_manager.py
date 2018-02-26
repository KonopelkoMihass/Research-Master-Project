from database_manager import DatabaseManager
from email_system import EmailSystem
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
			data = self.database_manager.select_all_from_table("Assignments")
			print("Retrieved Assignments Successfully")
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
			data = self.database_manager.select_all_from_table("Assignments")
			print("Retrieved Assignments Successfully")
		except:
			type = "assignment_delete_failed"
			print("Deleted Assignment Failed")

		message = [type, data]
		return message


	def get_assignments(self):
		print("add_assignment")
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

			submissions = self.database_manager.select_submissions_for_user(message_data["user_id"])

			for submission in submissions:
				submission_data = json.loads(submission["submission_data"])
				submission["submission_data"] = submission_data

				reviewers_ids = json.loads(submission["reviewers_ids"])
				submission["reviewers_ids"] = reviewers_ids

				feedbacks = json.loads(submission["feedbacks"])
				submission["feedbacks"] = feedbacks


			data = submissions

			print("Retrieved Submissions Successfully")
		except:
			type = "submit_assignment_failed"
			print("Submitted Assignment Failed")

		message = [type, data]
		return message

	def get_submissions(self, user_id):
		print("get_submissions")
		type = "get_submissions_successful"
		data = []

		try:
			submissions = self.database_manager.select_submissions_for_user(user_id)

			for submission in submissions:
				submission_data = json.loads(submission["submission_data"])
				submission["submission_data"] = submission_data

				reviewers_ids = json.loads(submission["reviewers_ids"])
				submission["reviewers_ids"] = reviewers_ids

				feedbacks = json.loads(submission["feedbacks"])
				submission["feedbacks"] = feedbacks

			data = submissions

			print("Get Submissions Successfully")
		except:
			type = "get_submissions_failed"
			print("Get Submissions Failed")

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



	def submit_review(self, message_data):
		print("submit_review")
		type = "submit_review_successful"
		data = []

		try:
			review = json.dumps(message_data["review"])
			message_data["review"] = review
			self.database_manager.add_review(message_data)
			print("Submitted Assignment Successfully")

			submissions = []
			if message_data["reviewer_role"] == "student":
				submissions = self.database_manager.select_submissions_for_user(message_data["reviewer_id"])
			else:
				submissions = self.database_manager.select_all_from_table("Submissions")


			for submission in submissions:
				submission_data = json.loads(submission["submission_data"])
				submission["submission_data"] = submission_data

				reviewers_ids = json.loads(submission["reviewers_ids"])
				submission["reviewers_ids"] = reviewers_ids

				feedbacks = json.loads(submission["feedbacks"])
				submission["feedbacks"] = feedbacks


			data = submissions

			print("Submit Review Successfully")
		except:
			type = "submit_review_failed"
			print("Submit Review  Failed")

		message = [type, data]
		return message








