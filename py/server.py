import tornado
import json

from user_manager import UserManager
from tornado import websocket, web, ioloop, httpserver
from tornado import autoreload


#A dictionary, key = ip:port, value = websocket associated with the ip
#(techincally the websockethandler associated with the ip, but it's easier
#to imagine as just the websocket.)
connections={}

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


	def signup(self, message_data):
		message_type = user_manager.signup(message_data)
		self.send_message(message_type, message_data)


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



	def on_close(self):
		print ("WebSocket closed")
		#Remove connection
		key = ""
		for k, item in connections.items():
			if item["socket"] == self:
				key = k
		connections.pop(key)
		print("Total Connections: ", len(connections))



	def send_message(self,type,data):
		print("send_message")
		msg=dict()
		msg["type"]=type
		msg["data"]=data
		msg=json.dumps(msg)
		self.write_message(msg)


user_manager = UserManager()
settings = {
	'debug':True	#includes autoreload
}

app= tornado.web.Application([
	#map the handler to the URI named "wstest"
	(r'/wstest', WSHandler),
], settings)

if __name__ == '__main__':
	server_port = 8080
	print("server ON")
	app.listen(server_port)
	ioloop = tornado.ioloop.IOLoop.instance()
	autoreload.start(ioloop)
	ioloop.start()
