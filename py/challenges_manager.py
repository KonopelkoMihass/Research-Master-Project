from database_manager import DatabaseManager
import random
import json
import os

class ChallengesManager:
    def __init__(self,database_manager):
        print("ChallengeManager: __init__")
        self.database_manager = database_manager
        self.focus_threshold = 8 # focus ignored above the value here
        self.challenge_directory = "/challenges/"
        self.code_format = ".code"
        self.issues_format = ".issues"




    def create_challenge(self, message_data):
        print("create_challenge")
        type = "teacher_create_challenge_successful"
        data = {}
        print(message_data)

        try:
            self.database_manager.insert_into_table("Challenges", message_data)
            self.save_challenges_from_db_into_files()
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
        challenge["code"] = self.get_from_file(challenge)

        return [type, challenge]

    def get_from_file(self, challenge):
        id = str(challenge["id"])
        language = challenge["language"]

        challenge_dir = os.getcwd() + \
                        self.challenge_directory + \
                        "/" + language + "/"

        ch = open(challenge_dir + id + self.code_format, 'r')
        return ch.read()





    def get_challenge_chain(self, message_data):
        type = "get_challenge_chain_successful"

        chain_length = message_data["length"]
        chain_language =  message_data["language"]
        chain_focus = message_data["focus"]

        gamified = message_data["gamified"]

        not_use_focus = random.randint(0,10)
        if (not_use_focus > self.focus_threshold and gamified == "n") or not chain_focus:
            chain_focus = 0

        chain = self.database_manager.get_challenges_for_chain(chain_language, chain_focus )

        random.shuffle(chain)
        chain = chain[0:chain_length]

        return [type, chain]



    def save_challenges_from_db_into_files(self):
        print("attempting to save stuff from db to directory")
        root_dir = os.getcwd()
        challenges_dir = root_dir + self.challenge_directory
        if not os.path.exists(challenges_dir):
            os.makedirs(challenges_dir)

        # get all challenges
        challenges = self.database_manager.select_all_from_table("Challenges")
        for i in range(0, len(challenges)):
            print("id", challenges[i]["id"])
            print("standard", challenges[i]["standard"])
            print("language", challenges[i]["language"])

            language_dir = challenges[i]["language"] + "/"
            if not os.path.exists(challenges_dir + language_dir):
                os.makedirs(challenges_dir + language_dir)

            id = str(challenges[i]["id"])
            code = challenges[i]["code"]
            issues = json.loads(challenges[i]["issues"])

            if not os.path.isfile(challenges_dir + language_dir + id + self.code_format):
                ch = open(challenges_dir + language_dir + id + self.code_format, 'w')
                ch.write(code)
                ch.close()

                ih = open(challenges_dir + language_dir + id + self.issues_format, 'w')
                for key in issues:
                    line_num = issues[key]["content"]
                    cat_name = issues[key]["standard"]["category"]
                    subcat_name = issues[key]["standard"]["subCategory"]
                    ih.write(line_num + ": " + cat_name + " -> " +subcat_name + "\n")
                ih.close()


























