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

			self.database_manager.insert_into_table("Submissions", message_data)
			print("Submitted Assignment Successfully")


			submissions = self.database_manager.select_all_from_table("Submissions")

			submission_data = json.loads(message_data["submission_data"])
			message_data["submission_data"] = submission_data

			reviewers_ids = json.loads(message_data["reviewers_ids"])
			message_data["reviewers_ids"] = reviewers_ids

			feedbacks = json.loads(message_data["feedbacks"])
			message_data["feedbacks"] = feedbacks




			print("Submissions:",submissions )
			for submission in submissions:
				if submission["user_id"] == message_data["user_id"]:
					data.append(submission)

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
			data = self.database_manager.select_submissions_from_assignments(user_id)
			print("Get Submissions Successfully")
		except:
			type = "get_submissions_failed"
			print("Get Submissions Failed")

		message = [type, data]
		return message












