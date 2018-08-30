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
        print(message_data)

        try:
            self.database_manager.insert_into_table("Challenges", message_data)
            print("Added Challenge Successfully")
        except:
            type = "teacher_create_challenge_failed"
            print("Added Challenge Failed")

        message = [type, data]
        return message

    def get_challenge(self, message_data):
        challenge_id = message_data["id"]
        type = "get_challenge_successful"
        challenge = {}
        challenge = self.database_manager.get_challenge(challenge_id)
        challenge["issues"] = json.loads(challenge["issues"])

        return [type, challenge]



    def get_challenge_chain(self, message_data):
        type = "get_challenge_chain_successful"
        print("MD", message_data)
        chain_length = message_data["length"]
        chain_language =  message_data["language"]
        chain = self.database_manager.get_challenges_for_chain(chain_language)

        random.shuffle(chain)
        chain = chain[0:chain_length]

        test = self.database_manager.select_all_from_table("Challenges")
        for i in range(len(test)):
            print(test[i]["code"], test[i]["issues"])


        return [type, chain]
