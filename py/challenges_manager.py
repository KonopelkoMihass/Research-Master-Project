from database_manager import DatabaseManager
import random
import json

class ChallengesManager:
    def __init__(self,database_manager):
        print("ChallengeManager: __init__")
        self.database_manager = database_manager

    def create_challenge(self, message_data):
        print("create_challenge")
        type = "teacher_create_challenge_successful"
        data = {}

        try:
            self.database_manager.insert_into_table("Challenges", message_data)
            print("Added Challenge Successfully")
        except:
            type = "teacher_create_challenge_failed"
            print("Added Challenge Failed")

        message = [type, data]
        return message
