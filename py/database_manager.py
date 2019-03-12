import time
import traceback
import json
from mysql.connector.pooling import MySQLConnectionPool
from mysql.connector import errorcode
from passlib.hash import sha256_crypt
import random
import string

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

        if table_name == "Users":
            my_dict["password"] = sha256_crypt.encrypt(my_dict["password"])


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
        result = False


        connector = self.cnxpool.get_connection()
        cursor = connector.cursor(dictionary=True)

        stmt = "SELECT * FROM Users WHERE Users.email='"+email+"' LIMIT 1"

        cursor.execute(stmt)
        data = cursor.fetchall()
        cursor.close()
        connector.close()

        if sha256_crypt.verify(password, data[0]["password"]):
            if data[0]["role"] == "teacher":
                result = True
        else:
            if password == data[0]["password"]:
                password = sha256_crypt.encrypt(password)
                stmt = "UPDATE Users SET Users.password = '" + password + "' WHERE Users.email='" + email + "'"
                cursor.execute(stmt)
                connector.commit()
                cursor.close()
                connector.close()
                result = True

        return result





    def change_password(self, email, old_pass, new_pass):
        connector = self.cnxpool.get_connection()
        cursor = connector.cursor(dictionary=True)

        stmt = "SELECT * FROM Users WHERE Users.email='" + email + "' LIMIT 1"
        cursor.execute(stmt)
        data = cursor.fetchall()[0]

        if "$5$rounds=" in data["password"]:
            if sha256_crypt.verify(old_pass, data["password"]):
                new_pass = sha256_crypt.encrypt(new_pass)
            else:
                return False
        else:
            if old_pass == data["password"]:
                new_pass = sha256_crypt.encrypt(new_pass)
            else:
                return False

        stmt = "UPDATE Users SET Users.password = '" + new_pass + "' WHERE Users.email='" + email + "'"
        cursor.execute(stmt)
        connector.commit()
        cursor.close()
        connector.close()
        return True





    def select_all_from_table(self, table_name):
        connector = self.cnxpool.get_connection()
        cursor = connector.cursor(dictionary=True)

        stmt = "SELECT * FROM `"+table_name+"`;"

        cursor.execute(stmt)
        data = cursor.fetchall()
        cursor.close()
        connector.close()

        return data


    def delete_assignment(self, id):
        id = str(id)

        connector = self.cnxpool.get_connection()
        cursor = connector.cursor(dictionary=True)

        stmt = ("DELETE FROM Assignments WHERE Assignments.id="+ id +" LIMIT 1")


        cursor.execute(stmt)

        connector.commit()
        cursor.close()
        connector.close()


    def delete_user(self, email):
        #Inserts a dictionary into table table_name

        connector = self.cnxpool.get_connection()
        cursor = connector.cursor(dictionary=True)

        stmt = ("DELETE FROM Users WHERE Users.email='"+email+"' LIMIT 1")

        cursor.execute(stmt)
        connector.commit()
        cursor.close()
        connector.close()

    def check_password(self, email, password):
        result = False

        connector = self.cnxpool.get_connection()
        cursor = connector.cursor(dictionary=True)


        try:
            query = ("SELECT * FROM Users WHERE Users.email='"+email+"'")
            print("000")
            cursor.execute(query)
            data = cursor.fetchall()[0]

            print("111")

            if "$5$rounds=" in data["password"]:
                if sha256_crypt.verify(password, data["password"]):
                    result = True

            else:
                if password == data["password"]:
                    password = sha256_crypt.encrypt(password)
                    stmt = "UPDATE Users SET Users.password = '" + password + "' WHERE Users.email='" + email + "'"
                    cursor.execute(stmt)
                    connector.commit()
                    result = True

        except:
            print("ERROR OCCURED")

        finally:
            cursor.close()
            connector.close()




        return result

    def get_user_info(self, message_data):
        #print ("get_user_data")
        email = message_data["email"]

        connector = self.cnxpool.get_connection()
        cursor = connector.cursor(dictionary=True)

        try:
            query = ("SELECT * FROM Users WHERE Users.email='"+email+"'")

            #print(query)

            cursor.execute(query)
            data = cursor.fetchall()[0]
            del data["password"]
        except: pass

        cursor.close()
        connector.close()
        return data

    def get_all_users(self):
        connector = self.cnxpool.get_connection()
        cursor = connector.cursor(dictionary=True)
        query = ("SELECT * FROM Users")
        
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
                    feedbacks[i]["review"] = data["review"]

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


    def record_challenge_performance(self, data):
        user_email = data["email"]
        challenges_performance = data["challenges_performance"]
        past_performance = []

        connector = self.cnxpool.get_connection()
        cursor = connector.cursor(dictionary=True)
        query = ("SELECT challenge_performance FROM Users WHERE Users.email='" +user_email + "';")
        cursor.execute(query)
        data = cursor.fetchall()

        if data[0]["challenge_performance"] != None:
            past_performance = json.loads(data[0]["challenge_performance"])

        past_performance.append(challenges_performance)

        print ("PERFORMANCE BS ", past_performance)

        query = ("UPDATE Users SET Users.challenge_performance = '" + json.dumps(past_performance) + "' WHERE Users.email='" + user_email + "';")
        cursor.execute(query)
        connector.commit()
        cursor.close()
        connector.close()




    def get_challenges_for_chain(self, language, focus, user_std_internalisation, chain_user_level, chain_is_exam, chain_stds_to_exam):
        connector = self.cnxpool.get_connection()
        cursor = connector.cursor(dictionary=True)
        available_standards = []


        #Get standards which are enabled and focus is empty.
        if focus == 0 and chain_is_exam == False:
            query = ("SELECT sub_category, id FROM Standards WHERE Standards.enabled='yes' AND Standards.name='"+language +"' AND Standards.unlocked_at_level<="+ chain_user_level +";")
            cursor.execute(query)
            available_standards = cursor.fetchall()
            print("FOCUS IGNORED")

        elif chain_is_exam == True:
            # query = 'INSERT into Challenges VALUES(%s, %s, %s, %s, %s, %s, %s)'
            # cursor.executemany(query, rows)
            for id in chain_stds_to_exam:
                query = 'SELECT sub_category, id FROM Standards WHERE Standards.id=' + str(id) +';'
                cursor.execute(query)
                available_standards.append(cursor.fetchall()[0])

            print ("EXAM: ", available_standards)
            #Check how many there are.
            STANDARD_AMOUNT_OF_EXAMS = 4
            curr_amount = len(chain_stds_to_exam)
            if curr_amount < STANDARD_AMOUNT_OF_EXAMS:
                stds_to_get = STANDARD_AMOUNT_OF_EXAMS - curr_amount
                stds_to_pick_from = []


                for k, v in user_std_internalisation.items():
                    for i in range(len(v["subcategories"])):
                        subcat = v["subcategories"][i]
                        if subcat["learnState"] == "Mastered":
                            print( "SS ", subcat)
                            std_dict = {}
                            std_dict["id"] = subcat["number"]
                            std_dict["sub_category"] = subcat["name"]

                            stds_to_pick_from.append(std_dict)

                random.shuffle(stds_to_pick_from)
                for i in range(len(stds_to_pick_from)):
                    if i < stds_to_get:
                        available_standards.append(stds_to_pick_from[i])
            print("EXAM TIME")

        else:
            for key in focus:
                query = ("SELECT sub_category, id FROM Standards WHERE Standards.enabled='yes' AND Standards.name='" + language + "' AND Standards.id='" + key["number"] + "';")
                cursor.execute(query)
                available_standards.extend(cursor.fetchall())
            print("FOCUS ONLY")


        print("Num of Available Standards: ", len(available_standards))


        query = ("SELECT Challenges.id, Challenges.issues, Challenges.difficulty FROM Challenges WHERE "
                 "Challenges.standard='"+language+"';")

        cursor.execute(query)
        challenges = cursor.fetchall()
        cursor.close()
        connector.close()

        print ("Challenges available", len(challenges))


        # Select the available to user standards
        challenges_allowed_for_user = []

        for chal in challenges:
            include_in_challenge_chain = True
            chal["issues"] = json.loads(chal["issues"])
            std_unlocked_for_issue = [False] * len(chal["issues"])
            index = 0

            for key in chal["issues"]:
                standard_in_issue = chal["issues"][key]["standard"]

                for i in range(len(available_standards)):
                    if available_standards[i]["id"] == standard_in_issue["number"]:
                        std_unlocked_for_issue[index] = True
                        continue
                index += 1

            for i in range(0, len(std_unlocked_for_issue)):
                if std_unlocked_for_issue[i] == False:
                    include_in_challenge_chain = False
                    continue

            if include_in_challenge_chain:
                challenges_allowed_for_user.append(chal)



        print("Num of Available Challenges: ", len(challenges_allowed_for_user))

        challenge_ids = []

        if chain_is_exam == False:
            for chal in challenges_allowed_for_user:
                for key in chal["issues"]:
                    standard_in_issue = chal["issues"][key]["standard"]

                    user_std_score = 0

                    if len(user_std_internalisation) != 0:
                        if standard_in_issue["category"] in user_std_internalisation:
                            user_std_subcategories = user_std_internalisation[standard_in_issue["category"]]["subcategories"]

                            for subcat in user_std_subcategories:
                                if subcat["number"] == standard_in_issue["number"]:
                                    user_std_score = subcat["score"]

                    if chain_is_exam == False and chal["difficulty"] == "easy" and user_std_score < 9:
                        challenge_ids.append(chal["id"])

                    elif focus != 0 and user_std_score == 10 and chal["difficulty"] == "hard":
                        challenge_ids.append(chal["id"])

            # remove possible duplications
            challenge_ids = list(set(challenge_ids))


        else:
            for i in range(len(available_standards)):

                fitting_exams = []

                for chal in challenges_allowed_for_user:
                    fits_exam_purposes = True



                    # If one issue does not fit the examed standard - eliminate
                    for key in chal["issues"]:
                        standard_in_issue = chal["issues"][key]["standard"]
                        if standard_in_issue["number"] != available_standards[i]["id"]:
                            fits_exam_purposes = False

                    # If succeeded - see if it is hard enough. If it is - save it.
                    if fits_exam_purposes == True:

                        if chal["difficulty"] == "hard":
                            fitting_exams.append(chal["id"])


                # Once all challenges available - pick one.
                random.shuffle(fitting_exams)
                print ("selecting exam ", fitting_exams)

                challenge_ids.append( fitting_exams[0])





        print("Challenge Ids", challenge_ids)
        return challenge_ids


    def wipe_challenge_table(self):
        connector = self.cnxpool.get_connection()
        cursor = connector.cursor(dictionary=True)
        query = ("TRUNCATE TABLE Challenges;")
        cursor.execute(query)
        connector.commit()
        cursor.close()
        connector.close()



    def parse_challenges_from_array(self, rows):
        connector = self.cnxpool.get_connection()
        cursor = connector.cursor(dictionary=True)

        print ("TEST CHALLENGE DATA", len(rows[0]))

        query = 'INSERT into Challenges VALUES(%s, %s, %s, %s, %s, %s, %s)'
        for i in range(0,len(rows)):
            print ("Challenge ", i ," Inserted")
            cursor.execute(query, rows[i])



        connector.commit()
        cursor.close()
        connector.close()



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

    def invert_systems(self, group_name):
        students = []
        connector = self.cnxpool.get_connection()
        cursor = connector.cursor(dictionary=True)

        query = ("UPDATE Users "
                 "SET Users.gamification = IF(Users.gamification = 'r' , 'r', "
                 "IF(Users.gamification = 'y' , 'n', 'y' )) WHERE Users.role='student' AND Users.team_name='"+group_name +"'")
        cursor.execute(query)
        connector.commit()

        query = ("SELECT * FROM Users WHERE Users.role='student'")
        cursor.execute(query)
        students = cursor.fetchall()
        cursor.close()
        connector.close()

        return students


    def enable_system_switch(self, group_name):
        students = []
        connector = self.cnxpool.get_connection()
        cursor = connector.cursor(dictionary=True)

        query = ("UPDATE Users SET Users.gamification = 'r'  WHERE Users.role='student' AND Users.team_name='"+group_name +"'")
        cursor.execute(query)
        connector.commit()

        query = ("SELECT * FROM Users WHERE Users.role='student'")
        cursor.execute(query)
        students = cursor.fetchall()

        cursor.close()
        connector.close()

        return students

    def record_instruction_email_data(self, email, str_data):
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
        print("SAVING STDS")
        connector = self.cnxpool.get_connection()
        cursor = connector.cursor(dictionary=True)
        for lang in standards:
            stds = standards[lang]
            for s in stds:
                try:
                    placeholders = ", ".join(["%s"] * len(s))
                    stmt = "INSERT INTO `{table}` ({columns}) VALUES ({values});".format(
                        table="Standards",
                        columns=",".join(s.keys()),
                        values=placeholders
                    )

                    cursor.execute(stmt, list(s.values()))
                    connector.commit()

                except:
                    pass

        cursor.close()
        connector.close()


    def forgot_password_temp_replacement(self, email):

        connector = self.cnxpool.get_connection()
        cursor = connector.cursor(dictionary=True)

        letters = string.ascii_lowercase
        new_password = ''.join(random.choice(letters) for i in range(12))

        sha_new_password = sha256_crypt.encrypt(new_password)

        query = ("SELECT password, name, surname FROM Users WHERE Users.email='"+ email +"'")
        cursor.execute(query)
        if len(cursor.fetchall()) > 0:
            query = "UPDATE Users SET Users.password = '" + sha_new_password + "' WHERE Users.email='" + email + "'"
            cursor.execute(query)
            connector.commit()

        else: new_password = ""

        cursor.close()
        connector.close()


        return new_password




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

        cursor.close()
        connector.close()


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


    def get_last_challenge_inserted(self):
        connector = self.cnxpool.get_connection()
        cursor = connector.cursor()
        query = "SELECT * FROM Challenges ORDER BY id DESC LIMIT 1"
        cursor.execute(query)

        data = cursor.fetchall()[0]
        data = list(data)

        issue_text = ""
        issues_dict = json.loads(data[2])
        for key in issues_dict:
            line_num = key.split('#')[1]
            category = issues_dict[key]["standard"]["category"]
            sub_category = issues_dict[key]["standard"]["subCategory"]
            issue_text += "At line " + str(line_num) + ": '" + category + "'->'" + sub_category + "'\n"

        data.insert(2, issue_text)

        data = tuple(data)

        cursor.close()
        connector.close()
        return data

    def get_teachers_names(self):
        connector = self.cnxpool.get_connection()
        cursor = connector.cursor(dictionary=True)
        query = "SELECT id, name, surname FROM Users WHERE role='teacher'"
        cursor.execute(query)
        result = cursor.fetchall()
        cursor.close()
        connector.close()

        return result

    def get_teacher_email(self, id):
        connector = self.cnxpool.get_connection()
        cursor = connector.cursor()
        query = "SELECT email FROM Users WHERE id=" +id + " LIMIT 1"
        cursor.execute(query)
        result = cursor.fetchall()[0][0]

        cursor.close()
        connector.close()
        return result



    def get_all_challenge_data(self):
        connector = self.cnxpool.get_connection()
        cursor = connector.cursor()

        query = ("SELECT * FROM Challenges")
        cursor.execute(query)
        data = cursor.fetchall()
        cursor.close()
        connector.close()

        print ("Reinserting", len(data), "challenges")
        for i in range(0, len(data)):
            data[i] = list(data[i])
            issue_text = ""
            issues_dict = json.loads(data[i][2])
            for key in issues_dict:
                line_num = key.split('#')[1]
                category = issues_dict[key]["standard"]["category"]
                sub_category = issues_dict[key]["standard"]["subCategory"]
                issue_text += "At line " + str(line_num) + ": '" + category + "'->'" + sub_category + "'\n"

                # Remove the html description
                if "description" in issues_dict[key]["standard"].keys():
                    del issues_dict[key]["standard"]["description"]

            data[i][2] = json.dumps(issues_dict)
            data[i].insert(2, issue_text)

        return data




