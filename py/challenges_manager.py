from database_manager import DatabaseManager
import random
import json

class ChallengesManager:
    def __init__(self,database_manager):
        print("ChallengeManager: __init__")
        self.database_manager = database_manager
        self.focus_threshold = 8 # focus ignored above the value here

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
        challenge_id = message_data
        type = "get_challenge_successful"
        challenge = {}
        challenge = self.database_manager.get_challenge(challenge_id)
        challenge["issues"] = json.loads(challenge["issues"])

        return [type, challenge]



    def get_challenge_chain(self, message_data):
        type = "get_challenge_chain_successful"

        chain_length = message_data["length"]
        chain_language =  message_data["language"]
        chain_focus = message_data["focus"]

        gamified = message_data["gamified"]

        not_use_focus = random.randint(0,10)
        if (not_use_focus > self.focus_threshold and gamified == "n") or not chain_focus:
            chain_focus = 0

        #test
        f_y = 0
        f_n = 0
        r = 0
        for i in range(0, 1000):
            r = random.randint(0,10)
            if r > self.focus_threshold:
                f_n += 1
            else:
                f_y += 1
        print("F_Y: ", f_y, "F_N: ", f_n)
        #test


        chain = self.database_manager.get_challenges_for_chain(chain_language, chain_focus )

        random.shuffle(chain)
        chain = chain[0:chain_length]

        return [type, chain]
