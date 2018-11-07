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
            "host":'mihass-g-mysql', #set host to mysql using docker run link
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

        placeholders = ", ".join(["%s"] * len(my_dict))

        stmt = "INSERT INTO `{table}` ({columns}) VALUES ({values});".format(
            table=table_name,
            columns=",".join(my_dict.keys()),
            values=placeholders
        )


        cursor.execute(stmt, list(my_dict.values()))

        connector.commit()
        cursor.close()
        connector.close()
        print("complete")


    def replace_into_table(self, table_name, my_dict):
        connector = self.cnxpool.get_connection()
        cursor = connector.cursor(dictionary=True)

        placeholders = ", ".join(["%s"] * len(my_dict))

        stmt = "REPLACE INTO `{table}` ({columns}) VALUES ({values});".format(
            table=table_name,
            columns=",".join(my_dict.keys()),
            values=placeholders
        )


        cursor.execute(stmt, list(my_dict.values()))

        connector.commit()
        cursor.close()
        connector.close()

    def check_if_teacher(self, message_data):
        email = message_data["email"]
        password = message_data["password"]

        connector = self.cnxpool.get_connection()
        cursor = connector.cursor(dictionary=True)

        stmt = "SELECT Users.role FROM Users WHERE Users.email='"+email+"' AND Users.password='" + password + "' LIMIT 1"

        # print(stmt)
        cursor.execute(stmt)
        data = cursor.fetchall()
        cursor.close()
        connector.close()
        print("TESTING IF TEACHER",data )

        if data[0]["role"] == "teacher":
             return True
        else:
            return False




    def select_all_from_table(self, table_name):
        connector = self.cnxpool.get_connection()
        cursor = connector.cursor(dictionary=True)

        stmt = "SELECT * FROM `"+table_name+"`;"

        #print(stmt)
        cursor.execute(stmt)
        data = cursor.fetchall()
        cursor.close()
        connector.close()

        return data


    def delete_assignment(self, id):
        #Inserts a dictionary into table table_name
        #print("delete assignment")
        id = str(id)

        connector = self.cnxpool.get_connection()
        cursor = connector.cursor(dictionary=True)

        stmt = ("DELETE FROM Assignments WHERE Assignments.id="+ id +" LIMIT 1")
        #print(stmt)

        cursor.execute(stmt)

        connector.commit()
        cursor.close()
        connector.close()


    def delete_user(self, email):
        #Inserts a dictionary into table table_name
        #print("delete user")
        connector = self.cnxpool.get_connection()
        cursor = connector.cursor(dictionary=True)

        stmt = ("DELETE FROM Users WHERE Users.email='"+email+"' LIMIT 1")
        #print("stmt:")
        #print(stmt)
        cursor.execute(stmt)
        connector.commit()
        cursor.close()
        connector.close()

    def check_password(self, email, password):
        #return true if successful
        #print("check_password")
        result = False

        connector = self.cnxpool.get_connection()
        cursor = connector.cursor(dictionary=True)

        query = ("SELECT * FROM Users WHERE Users.email='"+email+"' AND Users.password='"+password+"'")
        #print("query:")
        #print(query)

        cursor.execute(query)
        cursor.fetchall()

        if cursor.rowcount == 1:
            result = True

        cursor.close()
        connector.close()

        return result

    def get_user_info(self, message_data):
        #print ("get_user_data")
        email = message_data["email"]

        connector = self.cnxpool.get_connection()
        cursor = connector.cursor(dictionary=True)
        query = ("SELECT * FROM Users WHERE Users.email='"+email+"'")

        #print(query)

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

        #print(query)

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

    def select_submissions_for_user(self, user_id):
        print("select_submissions_from_assignments")
        user_id = str(user_id)
        connector = self.cnxpool.get_connection()
        cursor = connector.cursor(dictionary=True)
        query = ("SELECT * FROM Submissions WHERE Submissions.user_id=" + user_id )

        #print(query)

        cursor.execute(query)
        data = cursor.fetchall()

        cursor.close()
        connector.close()
        return data


    def add_review(self, data):
        print("add_review")
        connector = self.cnxpool.get_connection()

        # first we need to get the submission
        cursor = connector.cursor(dictionary=True)
        submission_id = str(data["submission_id"])
        query = ("SELECT * FROM Submissions WHERE Submissions.id=" + submission_id)
        cursor.execute(query)
        submission = cursor.fetchall()[0]
        cursor.close()
        connector.close()


        feedbacks = json.loads(submission["feedbacks"])
        feedbacks.append(data)
        submission["feedbacks"] = json.dumps(feedbacks)

        self.replace_into_table("Submissions", submission)


    def update_review(self, data):
        print("update_review")
        connector = self.cnxpool.get_connection()

        # first we need to get the submission
        cursor = connector.cursor(dictionary=True)
        submission_id = str(data["submission_id"])
        query = ("SELECT * FROM Submissions WHERE Submissions.id=" + submission_id)
        cursor.execute(query)
        submission = cursor.fetchall()[0]
        cursor.close()
        connector.close()

        feedbacks = json.loads(submission["feedbacks"])

        for i in range(0,len(feedbacks)):
            if feedbacks[i]["reviewer_id"] == data["reviewer_id"]:
                if feedbacks[i]["iteration_submitted"] == data["iteration_submitted"]:
                    #print("FEEDback old:", feedbacks[i])
                    print("FEEDback new:", data["review"])
                    feedbacks[i]["review"] = data["review"] #TEST THIS PLACE
                    print("WHY", feedbacks[i]["review"])

        submission["feedbacks"] = json.dumps(feedbacks)
        print ("RESULT:", submission["feedbacks"])

        self.replace_into_table("Submissions", submission)


    def get_logs_for_user(self,id):
        print("get_logs_for_user")
        connector = self.cnxpool.get_connection()

        logs = []

        # first we need to get the submission
        cursor = connector.cursor(dictionary=True)
        query = ("SELECT * FROM Logs WHERE Logs.user_id=" + str(id))
        cursor.execute(query)
        data = cursor.fetchall()
        cursor.close()
        connector.close()

        if data != []:
            logs = json.loads(data[0]["logs"])

        return logs


    def get_challenges_for_chain(self, language, focus):
        challenge_ids = []

        connector = self.cnxpool.get_connection()
        cursor = connector.cursor(dictionary=True)

        query = ""

        #Get standards which are enabled and focus is empty.
        if focus == 0:
            query = ("SELECT * FROM Standards WHERE Standards.enabled='yes' AND Standards.name='"+language+"';")
            print("FOCUS IGNORED")
        else:
            query = ("SELECT * FROM Standards WHERE Standards.enabled='yes' AND Standards.name='" + language + "' AND Standards.category='" + focus["category"] +"' AND Standards.sub_category='" + focus["subCategory"] +"';")
            print("FOCUS ONLY")


        cursor.execute(query)
        available_standards = cursor.fetchall()


        query = ("SELECT Challenges.id, Challenges.issues FROM Challenges WHERE "
                 "Challenges.standard='"+language+"';")

        cursor.execute(query)
        challenges = cursor.fetchall()
        cursor.close()
        connector.close()

        challenge_ids = []

        # For each challenge
        for chal in challenges:
            include_in_challenge_chain = True
            chal["issues"] = json.loads(chal["issues"])

            # For each std within issue
            for key in chal["issues"]:
                standard_in_issue = chal["issues"][key]["standard"]
                issue_std_is_enabled = False

                for avail_std in available_standards:
                    if avail_std["sub_category"] == standard_in_issue["subCategory"]:
                        issue_std_is_enabled = True

                if issue_std_is_enabled == False:
                    include_in_challenge_chain = False

            if include_in_challenge_chain == True:
                challenge_ids.append(chal["id"])


        print("GOT HERE", challenge_ids)
        return challenge_ids











    def get_challenge(self, id):
        connector = self.cnxpool.get_connection()
        cursor = connector.cursor(dictionary=True)
        query = ("SELECT * FROM Challenges WHERE "
                 "Challenges.id='"+str(id)+"';")

        cursor.execute(query)
        challenge = cursor.fetchall()[0]

        cursor.close()
        connector.close()

        return challenge

    def save_skills(self, data):
        email = data["email"]
        update_std_int = data["std_internalisation"]
        update_std_int_changes = data["std_internalisation_changes"]

        connector = self.cnxpool.get_connection()
        cursor = connector.cursor(dictionary=True)

        query = ("UPDATE Users SET Users.std_internalisation = '" +update_std_int + "',"
                                    "Users.std_internalisation_changes = '" + update_std_int_changes + "'  WHERE Users.email='"+email+"'")
        cursor.execute(query)
        connector.commit()
        cursor.close()
        connector.close()

    def get_students(self):
        students = []
        connector = self.cnxpool.get_connection()
        cursor = connector.cursor(dictionary=True)

        query = ("SELECT * FROM Users WHERE Users.role='student'")
        cursor.execute(query)
        students = cursor.fetchall()

        cursor.close()
        connector.close()
        return students

    def invert_systems(self):
        students = []
        connector = self.cnxpool.get_connection()
        cursor = connector.cursor(dictionary=True)

        query = ("UPDATE Users "
                 "SET Users.gamification = IF(Users.gamification = 'r' , 'r', "
                 "IF(Users.gamification = 'y' , 'n', 'y' )) WHERE Users.role='student'")
        cursor.execute(query)
        connector.commit()

        query = ("SELECT * FROM Users WHERE Users.role='student'")
        cursor.execute(query)
        students = cursor.fetchall()
        cursor.close()
        connector.close()

        return students


    def enable_system_switch(self):
        students = []
        connector = self.cnxpool.get_connection()
        cursor = connector.cursor(dictionary=True)

        query = ("UPDATE Users SET Users.gamification = 'r'  WHERE Users.role='student'")
        cursor.execute(query)
        connector.commit()

        query = ("SELECT * FROM Users WHERE Users.role='student'")
        cursor.execute(query)
        students = cursor.fetchall()

        cursor.close()
        connector.close()

        return students



    def enable_system_switch(self, email, str_data):
        students = []
        connector = self.cnxpool.get_connection()
        cursor = connector.cursor(dictionary=True)

        query = ("UPDATE Users SET Users.got_instruction_emails = '"+str_data+"'  WHERE Users.email = '" + email + "'")
        cursor.execute(query)
        connector.commit()
        cursor.close()
        connector.close()
















    def selected_system(self, message_data):
        email = message_data["email"]
        choice = message_data["choice"]

        connector = self.cnxpool.get_connection()
        cursor = connector.cursor(dictionary=True)

        query = ("UPDATE Users SET Users.gamification = '" + choice + "'  WHERE Users.email='" + email + "'")
        cursor.execute(query)
        connector.commit()

        cursor.close()
        connector.close()


    def save_parsed_standards(self, standards):
        try:
            connector = self.cnxpool.get_connection()
            cursor = connector.cursor(dictionary=True)

            for lang in standards:
                stds = standards[lang]
                for s in stds:
                    #rint("What is s here: ", s)
                    placeholders = ", ".join(["%s"] * len(s))

                    stmt = "INSERT INTO `{table}` ({columns}) VALUES ({values});".format(
                        table="Standards",
                        columns=",".join(s.keys()),
                        values=placeholders
                    )

                    cursor.execute(stmt, list(s.values()))
                    connector.commit()

        except:
            print ("already parsed it")





    def update_standards_configurations(self, standards):
        result = "update_standards_configurations_successful"
        #try:
        connector = self.cnxpool.get_connection()
        cursor = connector.cursor(dictionary=True)

        for s in standards:
            placeholders = ", ".join(["%s"] * len(s))

            stmt = "REPLACE INTO `{table}` ({columns}) VALUES ({values});".format(
                table="Standards",
                columns=",".join(s.keys()),
                values=placeholders
            )

            cursor.execute(stmt, list(s.values()))
            connector.commit()
        #except:
        #	result = "update_standards_configurations_failed"

        return result


    def get_standards(self, name):
        connector = self.cnxpool.get_connection()
        cursor = connector.cursor(dictionary=True)

        query = ("SELECT * FROM Standards WHERE Standards.name='"+ name +"'")
        cursor.execute(query)
        data =  cursor.fetchall()
        cursor.close()
        connector.close()
        return data
        pass

    def is_challenge_mode_only(self):
        connector = self.cnxpool.get_connection()
        cursor = connector.cursor(dictionary=True)

        query = ("SELECT * FROM Users WHERE Users.role='teacher'")
        cursor.execute(query)
        teacher = cursor.fetchall()[0]
        cursor.close()
        connector.close()
        return teacher["challenge_mode_only"]

    def challenge_mode_switch(self, state):
        try:
            connector = self.cnxpool.get_connection()
            cursor = connector.cursor(dictionary=True)

            value = ""
            if state == True:
                value = "y"
            else:
                value = "n"


            query = ("UPDATE Users "
                     "SET Users.challenge_mode_only = '" + value +"'")
            cursor.execute(query)
            connector.commit()
            cursor.close()
            connector.close()
            return "challenge_mode_switch_successful"
        except:
            return "challenge_mode_switch_failed"



    def change_focus(self, data):
        email = data["email"]
        focus = data["focus"]

        connector = self.cnxpool.get_connection()
        cursor = connector.cursor(dictionary=True)

        query = ("UPDATE Users SET Users.focus = '" +focus + "' WHERE Users.email='"+email+"'")
        cursor.execute(query)
        connector.commit()
        cursor.close()
        connector.close()





