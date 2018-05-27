import tornado
import json

from user_manager import UserManager
from assignments_manager import AssignmentsManager
import planner


from tornado import websocket, web, ioloop, httpserver
from tornado import autoreload
from tornado.ioloop import PeriodicCallback

#A dictionary, key = ip:port, value = websocket associated with the ip
#(techincally the websockethandler associated with the ip, but it's easier
#to imagine as just the websocket.)
connections={}

def globalDaemonMethod():
	update_clients = planner.update()
	#print ("Okay - Do we update =", update_clients)
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
			self.push_standard(message_data)

		elif message_type == "get_standard":
			self.get_standard()



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


user_manager = UserManager()
assignments_manager = AssignmentsManager()

settings = {
	'debug':True	#includes autoreload
}

app= tornado.web.Application([
	#map the handler to the URI named "wstest"
	(r'/GCodeReviewer', WSHandler),
], settings)

if __name__ == '__main__':
	server_port = 443 #replace with 8080 when putting on gamecore
	print("server ON")
	app.listen(server_port)
	ioloop = tornado.ioloop.IOLoop.instance()

	# runs a periodic update method to handle time based features.
	# go to daemon_update file to add/change the logic
	# set it to run 300000 for one run each 5 min or so.
	PeriodicCallback(globalDaemonMethod, 15000).start()







	autoreload.start(ioloop)
	ioloop.start()
