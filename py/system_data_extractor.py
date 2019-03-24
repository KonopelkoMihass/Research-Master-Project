import httplib2

import os
import io
import json
import random

from apiclient import discovery
from oauth2client import client
from oauth2client import tools
from oauth2client.file import Storage
from apiclient import errors

from database_manager import DatabaseManager

from google.oauth2 import service_account
from apiclient.http import MediaFileUpload, MediaIoBaseDownload



try:
    import argparse
    flags = argparse.ArgumentParser(parents=[tools.argparser]).parse_args()
except ImportError:
    flags = None

SCOPES = ['https://www.googleapis.com/auth/spreadsheets']
SHEET = "1SzHjn0htetGEYtkCPNv2n4_Qz6nLpYbPpCx8czml63M"





def get_all_system_data(database_manager):
    # Google Sheet Service
    credentials = service_account.Credentials.from_service_account_file('private-secret.json', scopes=SCOPES)
    service = discovery.build('sheets', 'v4', credentials=credentials)

    #spreadsheet = service.spreadsheets().get(SHEET)

    # First we get all users aside teachers using MySQL
    raw_users = database_manager.select_all_from_table("Users")

    users = []


    for raw_user in raw_users:
        if raw_user["role"] == "student":
            user = {}
            user["id"] = str(raw_user["id"])
            user["fullname"] = raw_user["surname"] + " " + raw_user["name"]
            user["group"] = raw_user["team_name"]
            user["challenge_performance"] = raw_user["challenge_performance"]
            user["level_cpp"] = calculate_level(json.loads(raw_user["std_internalisation"]), "cpp")
            user["level_js"] = calculate_level(json.loads(raw_user["std_internalisation"]), "js")

            user["std_internalisation_changes"] = raw_user["std_internalisation_changes"]
            user["log_content"] = get_log_text(user["id"])

            days_data = list_days_system_was_used(user["log_content"])

            user["days_active"] = days_data["list"]
            user["total_days"] = days_data["total"]








            users = users + [user]


    # We will create it row by row basis
    rows = [create_row("IDs", users, "id")]
    rows = rows + [create_row("Names", users, "fullname")]
    rows = rows + [create_row("Group", users, "group")]
    rows = rows + [create_row("CPP Level", users, "level_cpp")]
    rows = rows + [create_row("JS Level", users, "level_js")]
    rows = rows + [create_row("Total Days Active", users, "total_days")]
    rows = rows + [create_row("List of days active", users, "days_active")]







    data_to_spreadsheet = {'values': rows}
    range_all = '{0}!A1:Z'.format("Sheet1")
    service.spreadsheets().values().clear(spreadsheetId=SHEET, range=range_all, body={}).execute()
    service.spreadsheets().values().update(spreadsheetId=SHEET, range='A1',
                                           body=data_to_spreadsheet,
                                           valueInputOption="RAW").execute()






def get_log_text(user_id):
    root_dir = os.getcwd()
    logs_dir = root_dir + "/logs/"

    user_logs_path = logs_dir + user_id + "/"
    filename = user_id + ".txt"

    fh = open(user_logs_path + filename, 'r')
    contents = fh.readlines()
    return contents


def create_row(title, users, key):
    newline = [title]
    for user in users:
        newline.append(user[key])
    return tuple(newline)


def calculate_level(user_internalisation, language):
    if language in user_internalisation:
        level = 1
        for category in user_internalisation[language]:
            for subcategory in user_internalisation[language][category]["subcategories"]:
                if subcategory["score"] == 10:
                     level = level + 1
        return str(level)
    else:
        return "0"


def list_days_system_was_used(log_content):
    total_days = 0
    day_list = []
    last_day = ""

    for line in log_content:
        date_str = line[1:11]
        if is_date(date_str):
            if date_str != last_day:
                total_days += 1
                last_day = date_str
                day_list+=[last_day+"\n"]


    return {"total":str(total_days), "list":''.join(day_list)}






def is_date(date_str):
    try:
        if date_str[4] == "-" and date_str[7] == "-":
            return True
    except:
        return False