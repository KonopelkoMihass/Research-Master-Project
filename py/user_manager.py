from database_manager import DatabaseManager
import json

class UserManager:
	def __init__(self, database_manager):
		print("UserManager: __init__")
		self.database_manager = database_manager

	def signin(self, message_data):
		"""Returns message type : string"""
		result = False
		message_type = "signin_failed"
		data = {}

		try:
			result = self.database_manager.check_password(message_data["email"],message_data["password"])
		except:
			message_type = "signin_failed"

		if result is True:
			message_type="signin_successful"
			data = self.database_manager.get_user_info(message_data)
			data["std_internalisation"] = json.loads(data["std_internalisation"])
			users = self.database_manager.get_all_users()
			data["users"] = users




		return [message_type, data]

	def signup(self, message_data):
		"""Returns message type : string"""
		data = {}
		message_type = "signup_successful"
		#try:
		all_users = self.database_manager.select_all_from_table("Users")
		gamified = 0
		non_gamified = 0

		for item in all_users:
			if item["gamification"] == 'n': non_gamified += 1
			if item["gamification"] == 'y': gamified += 1


		print ("G-NG  ", gamified,"-",non_gamified)

		if gamified >= non_gamified:
			message_data["gamification"] = 'n'
			print ("not gamified user")

		else:
			message_data["gamification"] = 'y'
			print ("gamified user")

		message_data["std_internalisation"] = json.dumps(message_data["std_internalisation"])

		self.database_manager.insert_into_table("Users", message_data)
		data = self.database_manager.get_user_info(message_data)

		#except:
		#	message_type = "signup_failed"

		message = [message_type, data]
		return message

	def save_standard_internalisation(self, email, std_int):




		pass



