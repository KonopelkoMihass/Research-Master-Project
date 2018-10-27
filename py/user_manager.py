from database_manager import DatabaseManager
import json

class UserManager:
    def __init__(self, database_manager, email_system):
        print("UserManager: __init__")
        self.database_manager = database_manager
        self.email_system = email_system

    def signin(self, message_data):
        """Returns message type : string"""
        result = False
        message_type = "signin_failed"
        data = {}

        try:
            result = self.database_manager.check_password(message_data["email"], message_data["password"])
        except:
            message_type = "signin_failed"

        if result is True:
            message_type="signin_successful"

            data = self.database_manager.get_user_info(message_data)

            data["std_internalisation"] = json.loads(data["std_internalisation"])
            data["got_instruction_emails"] = json.loads(data["got_instruction_emails"])
            data["std_internalisation_changes"] = json.loads(data["std_internalisation_changes"])
            data["focus"] = json.loads(data["focus"])

            users = self.database_manager.get_all_users()
            data["users"] = users

            is_gamified = data["gamification"]
            sent_instructions = data["got_instruction_emails"]
            print ("INSTRUCTIONS", sent_instructions)
            if is_gamified == "y":
                if "sent_gamified" in sent_instructions:
                    pass
                else:
                    data["got_instruction_emails"]["sent_gamified"] = "yes"
                    self.email_system.send_gamification_email(data)
                    self.database_manager.enable_system_switch(data["email"], json.dumps(data["got_instruction_emails"]))


            elif is_gamified == "n":
                if "sent_non_gamified" in sent_instructions:
                    pass
                else:
                    data["got_instruction_emails"]["sent_non_gamified"] = "yes"
                    self.email_system.send_non_gamification_email(data)
                    self.database_manager.enable_system_switch(data["email"], json.dumps(data["got_instruction_emails"]))






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

        if gamified >= non_gamified:
            message_data["gamification"] = 'n'
            print ("not gamified user")

        else:
            message_data["gamification"] = 'y'
            print ("gamified user")


        message_data["challenge_mode_only"] = self.database_manager.is_challenge_mode_only()
        message_data["std_internalisation"] = json.dumps(message_data["std_internalisation"])
        message_data["got_instruction_emails"] = json.dumps(message_data["got_instruction_emails"])
        message_data["std_internalisation_changes"] = json.dumps(message_data["std_internalisation_changes"])
        message_data["focus"] = json.dumps(message_data["focus"])


        self.database_manager.insert_into_table("Users", message_data)
        data = self.database_manager.get_user_info(message_data)

        #except:
        #	message_type = "signup_failed"

        message = [message_type, data]
        return message

    def save_standard_internalisation(self, email, std_int):
        pass

    def check_emails_to_send(self):
        pass




