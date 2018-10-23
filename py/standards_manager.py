from __future__ import print_function
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

from bs4 import BeautifulSoup

try:
    import argparse
    flags = argparse.ArgumentParser(parents=[tools.argparser]).parse_args()
except ImportError:
    flags = None

SCOPES = ['https://www.googleapis.com/auth/drive']

class StandardsManager:
    def __init__(self, database_manager):
        self.database_manager = database_manager
        self.standards_ids = {
            "js": "1O9vsT2hlG12W5czOLZ0aD-Y2UgOUDJQljzUv0GuWFvs",
            "cpp": "11quSKE8cKf2mD5rFFcWvZe0765mdH81iJ8eWwSXvXX8"
        }

        self.standards = {}
        self.standards_names = {}

        self.google_path = "https://docs.google.com/document/d/"

        credentials = service_account.Credentials.from_service_account_file('private-secret.json', scopes=SCOPES)
        self.service = discovery.build('drive', 'v3', credentials=credentials)

        for key, value in self.standards_ids.items():
            self.download_standard( key, value, "text/html")
            print("Finished downloading", key )

        self.database_manager.save_parsed_standards(self.standards)






    def download_standards_from_drive(self, socket):
        for key, value in self.standards_ids.items():
            self.download_standard( key, value, "text/html")
            socket.send_message("get_standard_successful", self.get_standard(key))
            print("Finished downloading", key )



    def download_standard(self, key, file_id,  mime_type):
        file = self.service.files().get(fileId=file_id,fields='name').execute()

        request = self.service.files().export(fileId=file_id, mimeType=mime_type)
        fh = io.BytesIO()
        downloader = MediaIoBaseDownload(fh, request)
        done = False
        while done is False:
            status, done = downloader.next_chunk()
            print("Download %d%%." % int(status.progress() * 100))

        fh.seek(0)
        html = fh.read()

        self.standards[key] = self.parse_standard_from_html(key, html)
        self.standards_names[key] = file.get('name')


    def parse_standard_from_html(self, key, html):
        soup = BeautifulSoup(html, 'html.parser')
        node_list = soup.find_all(["h2", "h3"])

        standard = []
        for n in node_list:
            if n.get_text() == "":
                pass

            if n.name == "h2":
                category = n.get_text().rstrip()
                for elem in n.next_siblings:
                    if elem.name == "h3":
                        standard_bit = {}
                        standard_bit["category"] = category
                        standard_bit["sub_category"] = elem.get_text().rstrip()
                        standard_bit["description"] = ""
                        standard_bit["name"] = key
                        standard_bit["reward_score"] = 1
                        standard_bit["penalty_score"] = 3
                        standard_bit["enabled"] = "yes"

                        for sub_elem in elem.next_siblings:
                            if sub_elem.name == 'p' or sub_elem.name == 'ul':
                                description = str(sub_elem)
                                standard_bit["description"] += description
                            else:
                                break
                        standard.append(standard_bit)
                    if elem.name == "h2":
                        break



        return standard

    def get_standard(self, name):

        data = {}
        data["standard"] = self.database_manager.get_standards(name)
        data["url"] = self.google_path + self.standards_ids[name]
        data["name"] = self.standards_names[name]
        data["standard_id"] = name
        return data


    def update_standards_configurations(self, data):
        return self.database_manager.update_standards_configurations(data)

