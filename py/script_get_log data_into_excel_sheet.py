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
SHEET = "1SzHjn0htetGEYtkCPNv2n4_Qz6nLpYbPpCx8czml63M"


def generate_data(team_name):
    # Establish google drive service.
    credentials = service_account.Credentials.from_service_account_file('private-secret.json', scopes = SCOPES)
    service = discovery.build('sheets', 'v4', credentials=credentials)

    log_directory = "/logs/"

    #There we implement the log transcription logic









    # service.spreadsheets().values().update(spreadsheetId=SHEET_DB_ID, range=insert_here, body=for_google_sheet, valueInputOption="RAW").execute()
























