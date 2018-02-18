import time
import traceback
import json
from mysql.connector.pooling import MySQLConnectionPool
from mysql.connector import errorcode


class DatabaseManager:

	def __init__(self):
		print("DatabaseManager: __init__")
		self.createConnectionPool()

	def createConnectionPool(self):
		dbconfig = {
		"user": "root",
		"password":"xboxorpc7",
		"host":'mysql', #set host to mysql using docker run link
		"database":'ProjectOrganiser',
		"port":'3306'
		}

		try:
			self.cnxpool = MySQLConnectionPool(
				pool_name = "mypool",
				pool_size = 32,
				**dbconfig)
		except:
			# sleep - hopefully will help - might be that the MySQL
			#container is not up and running yet
			print("Exception... sleeping for 5 seconds then retry")
			tb = traceback.format_exc()
			print("tb: " + tb)
			time.sleep(5)
			# try again
			return self.createConnectionPool()

	def insert_into_table(self, table_name, my_dict):
		connector = self.cnxpool.get_connection()
		cursor = connector.cursor(dictionary=True)

		columns = ', '.join(my_dict.keys())
		placeholders = ", ".join(["%s"] * len(my_dict))

		print("TEST", columns, placeholders)

		stmt = "INSERT INTO `{table}` ({columns}) VALUES ({values});".format(
			table=table_name,
			columns=",".join(my_dict.keys()),
			values=placeholders
		)

		print(stmt)
		cursor.execute(stmt, list(my_dict.values()))

		connector.commit()
		cursor.close()
		connector.close()
		print("complete")


	def replace_into_table(self, table_name, my_dict):
		connector = self.cnxpool.get_connection()
		cursor = connector.cursor(dictionary=True)

		columns = ', '.join(my_dict.keys())
		placeholders = ", ".join(["%s"] * len(my_dict))

		print("TEST", columns, my_dict)

		stmt = "REPLACE INTO `{table}` ({columns}) VALUES ({values});".format(
			table=table_name,
			columns=",".join(my_dict.keys()),
			values=placeholders
		)

		print(stmt)
		cursor.execute(stmt, list(my_dict.values()))

		connector.commit()
		cursor.close()
		connector.close()


	def select_all_from_table(self, table_name):
		connector = self.cnxpool.get_connection()
		cursor = connector.cursor(dictionary=True)

		stmt = "SELECT * FROM `"+table_name+"`;"

		print(stmt)
		cursor.execute(stmt)
		data = cursor.fetchall()
		cursor.close()
		connector.close()

		return data


	def delete_assignment(self, id):
		#Inserts a dictionary into table table_name
		print("delete assignment")
		id = str(id)

		connector = self.cnxpool.get_connection()
		cursor = connector.cursor(dictionary=True)

		stmt = ("DELETE FROM Assignments WHERE Assignments.id="+ id +" LIMIT 1")
		print(stmt)

		cursor.execute(stmt)

		connector.commit()
		cursor.close()
		connector.close()


	def delete_user(self, email):
		#Inserts a dictionary into table table_name
		print("delete user")
		connector = self.cnxpool.get_connection()
		cursor = connector.cursor(dictionary=True)

		stmt = ("DELETE FROM Users WHERE Users.email='"+email+"' LIMIT 1")
		print("stmt:")
		print(stmt)
		cursor.execute(stmt)
		connector.commit()
		cursor.close()
		connector.close()

	def check_password(self, email, password):
		#return true if successful
		print("check_password")
		result = False

		connector = self.cnxpool.get_connection()
		cursor = connector.cursor(dictionary=True)

		query = ("SELECT * FROM Users WHERE Users.email='"+email+"' AND Users.password='"+password+"'")
		print("query:")
		print(query)

		cursor.execute(query)
		cursor.fetchall()

		if cursor.rowcount == 1:
			result = True

		cursor.close()
		connector.close()

		return result

	def get_user_info(self, message_data):
		print ("get_user_data")
		email = message_data["email"]

		connector = self.cnxpool.get_connection()
		cursor = connector.cursor(dictionary=True)
		query = ("SELECT * FROM Users WHERE Users.email='"+email+"'")

		print(query)

		cursor.execute(query)
		datas = cursor.fetchall()
		data = datas[0]

		cursor.close()
		connector.close()
		return data

	def get_all_users(self):
		connector = self.cnxpool.get_connection()
		cursor = connector.cursor(dictionary=True)
		query = ("SELECT * FROM Users")

		print(query)

		cursor.execute(query)
		users_table = cursor.fetchall()
		cursor.close()
		connector.close()

		#sort it
		users = []
		for user_table in users_table:
			user = {}
			user["email"] = user_table["email"]
			user["name"] = user_table["name"]
			user["surname"] = user_table["surname"]
			users.append(user)

		return users

	def select_submissions_from_assignments(self, user_id):
		print("select_submissions_from_assignments")
		user_id = str(user_id)
		connector = self.cnxpool.get_connection()
		cursor = connector.cursor(dictionary=True)
		query = ("SELECT * FROM Submissions WHERE Submissions.user_id='" + user_id + "'")

		print(query)

		cursor.execute(query)
		data = cursor.fetchall()

		cursor.close()
		connector.close()
		return data
