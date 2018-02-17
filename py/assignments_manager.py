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

















