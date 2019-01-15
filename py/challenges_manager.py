from database_manager import DatabaseManager
import random
import json
import os

import httplib2
import os
import io

from apiclient import discovery
from oauth2client import client
from oauth2client import tools
from oauth2client.file import Storage
from apiclient import errors

from google.oauth2 import service_account

from apiclient.http import MediaFileUpload, MediaIoBaseDownload

try:
    import argparse
    flags = argparse.ArgumentParser(parents=[tools.argparser]).parse_args()
except ImportError:
    flags = None

SCOPES = ['https://www.googleapis.com/auth/spreadsheets']
SHEET_DB_ID = "1lMi8jbvtt3OCk6DnOqCxZZK1L3jVSSXI54b0OolBYcw"



class ChallengesManager:
    def __init__(self,database_manager):
        print("ChallengeManager: __init__")
        self.database_manager = database_manager
        self.focus_threshold = 8 # focus ignored above the value here
        self.challenge_directory = "/challenges/"
        self.code_format = ".code"
        self.issues_format = ".issues"

        credentials = service_account.Credentials.from_service_account_file('private-secret.json', scopes = SCOPES)

        self.service = discovery.build('sheets', 'v4', credentials=credentials)
        self.export_from_google_sheet()



    def create_challenge(self, message_data):
        label = "teacher_create_challenge_successful"
        data = {}

        code = message_data["code"]

        if message_data["language"] == "js":
            message_data["code"] = code.replace("\t", "  ")

        else:
            message_data["code"] = code.replace("\t", "    ")


        try:
            self.database_manager.insert_into_table("Challenges", message_data)

            values = self.database_manager.get_last_challenge_inserted()
            for_google_sheet =  {'values': [values ]}
            insert_here = 'A' + str(values[0]+1)


            self.service.spreadsheets().values().update(spreadsheetId=SHEET_DB_ID, range=insert_here, body=for_google_sheet,
                                                        valueInputOption="RAW").execute()


            print("Added Challenge Successfully")
        except:
            type = "teacher_create_challenge_failed"
            print("Added Challenge Failed")



        message = [label, data]
        return message


    def migrate_to_google_sheets(self):
        fields = ("ID", "Code", "Issues", "Issues HTML", "Average Time in Seconds", "Standard Used", "Language Used", "Difficulty")
        rows = self.database_manager.get_all_challenge_data()
        root_dir = os.getcwd()
        challenges_dir = root_dir + self.challenge_directory
        language_dir = rows[0][5] + "/"
        for i in range(0, len(rows)):
            ch = open(challenges_dir + language_dir + str(rows[i][0]) + self.code_format, 'r')
            rows[i][1] = ch.read()

        rows.insert(0, fields)
        data = {'values': rows}
        self.service.spreadsheets().values().update(spreadsheetId=SHEET_DB_ID, range='A1', body=data,
                                                    valueInputOption="RAW").execute()




    def export_from_google_sheet(self):
        self.database_manager.wipe_challenge_table()
        print("Wiped the old challenges")
        rows = self.service.spreadsheets().values().get(spreadsheetId=SHEET_DB_ID, range='Sheet1').execute().get('values', [])
        #remove the first row
        if rows:
            rows.pop(0)
            challenge_array = []

            for i in range(0, len(rows)):
                if len(rows[i]) > 0:
                    rows[i].pop(2)
                    rows[i].pop(0)
                    challenge_array.append(rows[i])

            for i in range(0, len(challenge_array)):
                challenge_array[i].insert(0, i + 1 )

            print("retrieved challenges from the Google Sheets")
            self.database_manager.parse_challenges_from_array(challenge_array)
            print("successfully saved them into local DB")

        #Push back the data from DB - in case it got re-organised.
        db_challenges = self.database_manager.get_all_challenge_data()

        fields = ("ID", "Code", "Issues", "Issues HTML", "Average Time in Seconds", "Standard Used", "Language Used", "Difficulty")

        db_challenges.insert(0, fields)
        data = {'values': db_challenges}

        print ("Clear the Google Sheet")
        range_all = '{0}!A1:Z'.format("Sheet1")
        body = {}
        self.service.spreadsheets().values().clear(spreadsheetId=SHEET_DB_ID, range=range_all, body=body).execute()

        print ("Re-insert the challenges into sheet")
        self.service.spreadsheets().values().update(spreadsheetId=SHEET_DB_ID, range='A1', body=data,
                                                    valueInputOption="RAW").execute()

        print ("Challenges are on board!")









    def get_challenge(self, message_data):
        challenge_id = message_data
        type = "get_challenge_successful"
        challenge = {}
        challenge = self.database_manager.get_challenge(challenge_id)
        challenge["issues"] = json.loads(challenge["issues"])


        return [type, challenge]







    def get_challenge_chain(self, message_data):
        label = "get_challenge_chain_successful"

        chain_length = message_data["length"]
        chain_language =  message_data["language"]
        chain_focus = message_data["focus"]
        chain_user_std_internalisation = message_data["std_internalisation"]
        chain_user_level = str(message_data["user_level"])

        gamified = message_data["gamified"]

        not_use_focus = random.randint(0,10)
        if (not_use_focus > self.focus_threshold and gamified == "n") or not chain_focus:
            chain_focus = 0

        chain = self.database_manager.get_challenges_for_chain(chain_language, chain_focus, chain_user_std_internalisation, chain_user_level)
        print

        random.shuffle(chain)
        chain = chain[0:chain_length]

        return [label, chain]




    #deprecated - save to file
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


























