import tornado
import json
import random

from challenges_manager import ChallengesManager
from database_manager import DatabaseManager
from user_manager import UserManager
from assignments_manager import AssignmentsManager
from standards_manager import StandardsManager
from email_system import EmailSystem


import planner
import os

from tornado import websocket, web, ioloop, httpserver
from tornado import autoreload
from tornado.ioloop import PeriodicCallback

#A dictionary, key = ip:port, value = websocket associated with the ip
#(techincally the websockethandler associated with the ip, but it's easier
#to imagine as just the websocket.)
connections={}

def globalDaemonMethod():
    update_clients = planner.update()
    #print ("Okay - Do we trackServerMessages =", update_clients)
    if update_clients == True:
        for k, item in connections.items():
            item["socket"].get_assignments()
            if item["user_data"]["role"] == "teacher":
                item["socket"].get_all_submissions()
            else:
                item["socket"].get_submissions(item["user_data"]["id"])



class WSHandler(tornado.websocket.WebSocketHandler):
    #This can be used to restrict which ip addresses can connect to the server
    #return True means any machine can connect
    def check_origin(self, origin):
        return True

    def open(self):
        pass
        #standards_manager.download_standards_from_drive(self)
        print ("WebSocket opened")


    def on_message(self, message):
        #convert message into a dictionary
        message = json.loads(message)
        message_type = message["type"]
        message_data = message["data"]

        if message_type == "signup":
            self.signup(message_data)

        elif message_type == "signin":
            self.signin(message_data)


            self.send_message("get_standard_successful", standards_manager.get_standard("cpp"))
            self.send_message("get_standard_successful", standards_manager.get_standard("js"))

        elif message_type == "add_assignment":
            self.add_assignment(message_data)

        elif message_type == "get_assignments":
            self.get_assignments()

        elif message_type == "delete_assignment":
            self.delete_assignment(message_data["id"])

        elif message_type == "submit_assignment":
            self.submit_assignment(message_data)

        elif message_type == "get_submissions":
            self.get_submissions(message_data["user_id"])

        elif message_type == "get_all_submissions":
            self.get_all_submissions()

        elif message_type == "submit_review":
            self.submit_review(message_data)

        elif message_type == "push_standard":
            pass
        #self.push_standard(message_data)

        elif message_type == "get_standard":
            pass
        #self.get_standard()

        elif message_type == "save_logs":
            self.save_logs(message_data)

        elif message_type == "create_challenge":
            self.create_challenge(message_data)

        elif message_type == "get_challenge":
            self.get_challenge(message_data)

        elif message_type == "get_challenge_chain":
            self.get_challenge_chain(message_data)

        elif message_type == "update_skills":
            self.update_skills(message_data)

        elif message_type == "upload_challenge_results":
            self.upload_challenge_results(message_data)

        elif message_type == "get_students":
            self.get_students()

        elif message_type == "invert_systems":
            self.invert_systems()

        elif message_type == "enable_system_switch":
            self.enable_system_switch()

        elif message_type == "selected_system":
            self.selected_system(message_data)

        elif message_type == "update_standards_configurations":
            self.update_standards_configurations(message_data)

        elif message_type == "challenge_mode_switch":
            self.challenge_mode_switch(message_data)





    def signup(self, message_data):
        message= user_manager.signup(message_data)
        self.send_message(message[0], message[1])

        if  message[0] =="signup_successful":
            #Save connection in there.
            ip_address = ""

            # Get IP and Port from connection context if possible
            address = self.request.connection.context.address
            if address:
                ip = address[0]
                port = str(address[1])
                ip_address = ip + ":" + port

            # Original method
            else:
                ip = self.request.remote_ip
                port = self.request.stream.socket.getpeername()[1]
                ip_address = ip + ":" + str(port)

            print("signup successful", ip_address)
            message[1]["users"] = {}

            connection = {}
            connection["ip"] = ip_address
            connection["socket"] = self
            connection["user_data"] = message[1]

            connections[message[1]["email"]] = 	connection

            print("Connections", connections)


    def signin(self, message_data):
        message = user_manager.signin(message_data)
        self.send_message(message[0], message[1])

        if message[0] =="signin_successful":
            #Save connection in there.
            ip_address = ""

            # Get IP and Port from connection context if possible
            address = self.request.connection.context.address
            if address:
                ip = address[0]
                port = str(address[1])
                ip_address = ip + ":" + port

            # Original method
            else:
                ip = self.request.remote_ip
                port = self.request.stream.socket.getpeername()[1]
                ip_address = ip + ":" + str(port)

            message[1]["users"] = {}

            connection = {}
            connection["ip"] = ip_address
            connection["socket"] = self
            connection["user_data"] = message[1]

            connections[message[1]["email"]] = 	connection

            print("Connections", connections)

    def add_assignment(self, message_data):
        message = assignments_manager.add_assignment(message_data)
        self.send_message(message[0],{})
        for k, item in connections.items():
            item["socket"].get_assignments()
            if item["user_data"]["role"] == "teacher":
                item["socket"].get_all_submissions()
            else:
                item["socket"].get_submissions(item["user_data"]["id"])

    def delete_assignment(self, id):
        message = assignments_manager.delete_assignment(id)
        self.send_message(message[0], {})
        for k, item in connections.items():
            item["socket"].get_assignments()
            if item["user_data"]["role"] == "teacher":
                item["socket"].get_all_submissions()
            else:
                item["socket"].get_submissions(item["user_data"]["id"])

    def get_assignments(self):
        message = assignments_manager.get_assignments()
        self.send_message(message[0], message[1])

    def submit_assignment(self, message_data):
        message = assignments_manager.submit_assignment(message_data)
        self.send_message(message[0], {})
        for k, item in connections.items():
            item["socket"].get_assignments()
            if item["user_data"]["role"] == "teacher":
                item["socket"].get_all_submissions()
            else:
                item["socket"].get_submissions(item["user_data"]["id"])

    def get_submissions(self, user_id):
        message = assignments_manager.get_submissions(user_id)
        self.send_message(message[0], message[1])

    def get_all_submissions(self):
        message = assignments_manager.get_all_submissions()
        self.send_message(message[0], message[1])

    def submit_review(self, message_data):
        message = assignments_manager.submit_review(message_data)
        self.send_message(message[0], {})
        for k, item in connections.items():
            item["socket"].get_assignments()
            if item["user_data"]["role"] == "teacher":
                item["socket"].get_all_submissions()
            else:
                item["socket"].get_submissions(item["user_data"]["id"])

    def push_standard(self, message_data):
        message = assignments_manager.push_standard(message_data)
        self.send_message(message[0], message[1])
        for k, item in connections.items():
            item["socket"].get_standard()

    def get_standard(self):
        message = assignments_manager.get_standard()
        self.send_message(message[0], message[1])


    def save_logs(self,message_data):
        user_id = str(message_data["user_id"])
        print ("Dealing with logs")

        #saved_logs = database_manager.get_logs_for_user(user_id)
        #saved_logs.extend( message_data["logs"])

        #message_data["logs"] = json.dumps(saved_logs)

        type = "save_logs_successful"


        root_dir = os.getcwd()
        logs_dir = root_dir + "/logs/"
        if not os.path.exists(logs_dir):
            os.makedirs(logs_dir)

        user_logs_path = logs_dir + user_id + "/"
        if not os.path.exists(user_logs_path):
            os.makedirs(user_logs_path)

        filename = user_id + ".txt"

        fh = open(user_logs_path + filename, 'a')
        for i in range(0, len(message_data["logs"])):
            print("TEST:",  message_data["logs"][i]["type"])
            line = message_data["logs"][i]
            date = line["datetime"]
            side = line["side"]
            type = line["type"]

            date = date.replace("T"," ")
            date = date.split(".")[0]


            log = ""

            if type == "entered the site":
                log = "["+date+"] [" + side + "] "
                log += "User entered the site\n"

            if type == "leaving the site":
                log = "[" + date + "] [" + side + "] "
                log += "User left the site\n"

            if type == "challenge chain completed":
                content =  line["content"]
                log = "[" + date + "] [" + side + "] "
                log += "User completed chain challenge: Total Score - " + str(content["score"]) + "\n"

            if type == "challenge chain started":
                log = "[" + date + "] [" + side + "] "
                log += "User started a chain challenge\n"

            if type == "challenge started":
                log = "[" + date + "] [" + side + "] "
                log += "Challenge N" + str(line["content"]) + " started\n"

            if type == "challenge completed":
                content =  line["content"]
                log = "[" + date + "] [" + side + "] "
                log += "User completed challenge: \n"
                log += "Missed - " + str(content["missed"]) + "\n"
                log += "Found - " + str(content["correct"]) + "\n"
                log += "Mistakes - " + str(content["wrong"]) + "\n"

            if type == "tooltip_click":
                log = "[" + date + "] [" + side + "] "
                log += "User clicked a tooltip\n"

            if type == "profile_visit":
                log = "[" + date + "] [" + side + "] "
                log += "User visited profile page\n"




            fh.write(log)


        print("done")
        fh.close()

        self.send_message(type, {})

    def create_challenge(self, message_data):
        message_data["code"] = message_data["code"]
        message_data["issues"] = json.dumps(message_data["issues"])
        message = challenges_manager.create_challenge(message_data)
        self.send_message(message[0], message[1])

    def get_challenge(self, message_data):
        data = challenges_manager.get_challenge(message_data)
        self.send_message(data[0], data[1])


    def get_challenge_chain(self, message_data):
        data = challenges_manager.get_challenge_chain(message_data)
        self.send_message(data[0], data[1])

    def update_skills(self, message_data):
        message_data["std_internalisation"] = json.dumps(message_data["std_internalisation"])
        message_data["std_internalisation_changes"] = json.dumps(message_data["std_internalisation_changes"])
        result =  "upload_challenge_results_successful"
        try:
            database_manager.save_skills(message_data)
        except:
            result = "upload_challenge_results_failed"

        self.send_message(result, {})


    def upload_challenge_results(self, message_data):
        # DO SAVING OF THE CHALLENGE PERFORMANCE.
        pass


    def get_students(self):
        students = []
        result = "get_students_successful"
        try:
            students = database_manager.get_students()
            for student in students:
                student["std_internalisation"] = json.loads(student["std_internalisation"])
        except:
            result = "get_students_failed"

        self.send_message(result, students)


    def invert_systems(self):
        students = []
        result = "invert_systems_successful"
        try:
            students = database_manager.invert_systems()
            for student in students:
                student["std_internalisation"] = json.loads(student["std_internalisation"])
        except:
            result = "invert_systems_failed"
        self.send_message(result, students)

        for k, item in connections.items():
            item["socket"].get_assignments()
            if item["user_data"]["role"] == "student":
                item["socket"].kick_from_website()


    def enable_system_switch(self):
        students = []
        result = "enable_system_switch_successful"
        try:
            students = database_manager.enable_system_switch()
            for student in students:
                student["std_internalisation"] = json.loads(student["std_internalisation"])
        except:
            result = "enable_system_switch_failed"
        self.send_message(result, students)
        for k, item in connections.items():
            item["socket"].get_assignments()
            if item["user_data"]["role"] == "student":
                item["socket"].kick_from_website()


    def selected_system(self, message_data):
        database_manager.selected_system(message_data)
        for k, item in connections.items():
            item["socket"].get_assignments()
            if item["user_data"]["role"] == "student":
                item["socket"].kick_from_website()
            elif item["user_data"]["role"] == "teacher":
                item["socket"].get_students()

    def update_standards_configurations(self, message_data):
        result = standards_manager.update_standards_configurations(message_data)
        self.send_message(result, {})
        for k, item in connections.items():
            item["socket"].get_assignments()
            if item["user_data"]["role"] == "student":
                item["socket"].kick_from_website()


    def challenge_mode_switch(self, message):
        result = database_manager.challenge_mode_switch(message)
        print(result)
        self.send_message(result, {})
        for k, item in connections.items():
            item["socket"].get_assignments()
            if item["user_data"]["role"] == "student":
                item["socket"].kick_from_website()




    def kick_from_website(self):
        self.send_message("kick_from_website", {})








    def on_close(self):
        print ("WebSocket closed")
        #Remove connection
        key = ""
        try:
            for k, item in connections.items():
                if item["socket"] == self:
                    key = k
            connections.pop(key)
        except:
            print("Key Error")
        print("Total Connections: ", len(connections))

    def send_message(self,type,data):
        print("send_message")
        msg=dict()
        msg["type"]=type
        msg["data"]=data
        msg=json.dumps(msg)
        self.write_message(msg)


database_manager = DatabaseManager()
email_system = EmailSystem()
standards_manager = StandardsManager(database_manager)
user_manager = UserManager(database_manager, email_system)
assignments_manager = AssignmentsManager(database_manager)
challenges_manager = ChallengesManager(database_manager)



settings = {
    'debug':True	#includes autoreload
}

app= tornado.web.Application([
    #map the handler to the URI named "wstest"
    (r'/CRServer', WSHandler),
], settings)

if __name__ == '__main__':
    server_port = 8080
    print("server ON")
    app.listen(server_port)
    ioloop = tornado.ioloop.IOLoop.instance()

    # runs a periodic trackServerMessages method to handle time based features.
    # go to daemon_update file to add/change the logic
    # set it to run 300000 for one run each 5 min or so.
    PeriodicCallback(globalDaemonMethod, 15000).start()

    autoreload.start(ioloop)
    ioloop.start()
