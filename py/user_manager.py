from database_manager import DatabaseManager
import json
import os
import re



class UserManager:
    def __init__(self, database_manager, email_system):
        print("UserManager: __init__")
        self.database_manager = database_manager
        self.email_system = email_system





    def signin(self, message_data):
        """Returns message type : string"""
        result = False
        message_type = "signin_failed"
        data = {}
        try:
            result = self.database_manager.check_password(message_data["email"], message_data["password"])

            print ("RESULT ", result)
            if result is True:
                message_type="signin_successful"

                data = self.database_manager.get_user_info(message_data)

                data["std_internalisation"] = json.loads(data["std_internalisation"])
                data["got_instruction_emails"] = json.loads(data["got_instruction_emails"])
                data["std_internalisation_changes"] = json.loads(data["std_internalisation_changes"])
                data["focus"] = json.loads(data["focus"])
                data["teachers"] = self.database_manager.get_teachers_names()


                users = self.database_manager.get_all_users()
                data["users"] = users

                is_gamified = data["gamification"]
                sent_instructions = data["got_instruction_emails"]
                print ("INSTRUCTIONS", sent_instructions)
                if is_gamified == "y":
                    if "sent_gamified" in sent_instructions:
                        pass
                    else:
                        data["got_instruction_emails"]["sent_gamified"] = "yes"
                        self.email_system.send_gamification_email(data)
                        self.database_manager.enable_system_switch(data["email"], json.dumps(data["got_instruction_emails"]))


                elif is_gamified == "n":
                    if "sent_non_gamified" in sent_instructions:
                        pass
                    else:
                        data["got_instruction_emails"]["sent_non_gamified"] = "yes"
                        self.email_system.send_non_gamification_email(data)
                        self.database_manager.enable_system_switch(data["email"], json.dumps(data["got_instruction_emails"]))



        except:
            print("signin fail")

        return [message_type, data]

    def change_password(self, data):
        email = data["email"]
        old_pass = data["old_pass"]
        new_pass = data["new_pass"]

        message_type = "change_password_successful"

        try:
            result = self.database_manager.change_password(email, old_pass, new_pass)
            if result == False:
                message_type = "change_password_failed"
        except:
            message_type = "change_password_failed"

        return message_type




    def signup(self, message_data):
        """Returns message type : string"""
        data = {}
        message_type = "signup_successful"
        try:
            all_users = self.database_manager.select_all_from_table("Users")
            gamified = 0
            non_gamified = 0

            for item in all_users:
                if item["gamification"] == 'n': non_gamified += 1
                if item["gamification"] == 'y': gamified += 1

            if gamified >= non_gamified:
                message_data["gamification"] = 'n'
                print ("not gamified user")

            else:
                message_data["gamification"] = 'y'
                print ("gamified user")


            message_data["challenge_mode_only"] = self.database_manager.is_challenge_mode_only()
            message_data["std_internalisation"] = json.dumps(message_data["std_internalisation"])
            message_data["got_instruction_emails"] = json.dumps(message_data["got_instruction_emails"])
            message_data["std_internalisation_changes"] = json.dumps(message_data["std_internalisation_changes"])
            message_data["focus"] = json.dumps(message_data["focus"])


            self.database_manager.insert_into_table("Users", message_data)
            data = self.database_manager.get_user_info(message_data)

        except:
            message_type = "signup_failed"

        message = [message_type, data]
        return message



    def save_standard_internalisation(self, email, std_int):
        pass


    def check_emails_to_send(self):
        pass


    def analyze_and_reform_student_data(self,message_data):
        student_data = self.database_manager.get_user_info(message_data)
        id = str(student_data["id"])
        log_directory = os.getcwd() + "/logs/" + id + "/" + id + ".txt"

        data = {}
        log = ""
        try:
            log = open(log_directory, 'r').read()
        except:
            data["file"] = "Student " + student_data["name"] + " " + student_data["surname"] + " have not used the system."
            data["name"] = student_data["name"] + " " + student_data["surname"] + " Performance.txt"
            return data



        std_inter_changes = json.loads(student_data["std_internalisation_changes"])

        file = "Student: " + student_data["name"] + " " + student_data["surname"] + "\n"
        file += self.analyze_logs(log)
        file += self.analyze_internalisation(std_inter_changes)

        data = {}
        data["file"] = file
        data["name"] = student_data["name"] + " " + student_data["surname"] + " Performance.txt"

        return data



    def analyze_logs(self, log):
        file = "###The Actions Diary\n"
        processed_date = ""

        visited_site = 0
        completed_chains = 0
        scores = []
        tooltip_clicks = 0
        profile_visits = 0

        total_challenges_completed = 0
        total_issues_found = 0
        total_issues_missed = 0
        total_issues_mistakes = 0

        line_index = -1
        for line in log.splitlines():
            line_index += 1
            if line[0] == '[':
                date = line[1:11]

                if processed_date != date and processed_date != "":
                    file += "\n" + processed_date + " actions:\n"
                    file += "-Visited site: " + str(visited_site) + "\n"

                    if completed_chains > 0:
                        file += "-Completed chains: " + str(completed_chains) + " " + str(scores)
                        file += "\n"

                    if tooltip_clicks > 0:
                        file += "-Clicked tooltips: " + str(tooltip_clicks) + "\n"

                    if profile_visits > 0:
                        file += "-Visited profile page: " + str(profile_visits) + "\n"

                    if total_challenges_completed > 0:
                        file += "-Completed challenges: " + str(total_challenges_completed) + "\n"
                        file += "--Total found: " + str(total_issues_found) + "\n"
                        file += "--Total missed: " + str(total_issues_missed) + "\n"
                        file += "--Total mistakes: " + str(total_issues_mistakes) + "\n"

                    processed_date = date
                    visited_site = 0
                    completed_chains = 0
                    scores = []
                    tooltip_clicks = 0
                    profile_visits = 0
                    total_challenges_completed = 0
                    total_issues_found = 0
                    total_issues_missed = 0
                    total_issues_mistakes = 0

                elif processed_date != date and processed_date == "":
                    processed_date = date

                if "User entered the site" in line:
                    visited_site += 1

                elif "User completed chain challenge" in line:
                    completed_chains += 1
                    score = line[-3:].replace(" ", "")
                    scores.append(score)

                elif "User clicked a tooltip" in line:
                    tooltip_clicks += 1

                elif "User visited profile page" in line:
                    profile_visits += 1

                elif "User completed challenge" in line:
                    total_challenges_completed += 1

                    total_issues_missed += int(log.splitlines()[line_index + 1][-2:].replace(" ", ""))
                    total_issues_found += int(log.splitlines()[line_index + 2][-2:].replace(" ", ""))
                    total_issues_mistakes += int(log.splitlines()[line_index + 3][-2:].replace(" ", ""))

        #include last day
        file += "\n" + processed_date + " actions:\n"
        file += "-Visited site: " + str(visited_site) + "\n"

        if completed_chains > 0:
            file += "-Completed Chains: " + str(completed_chains) + " "
            file.join(scores)
            file += "\n"

        if tooltip_clicks > 0:
            file += "-Clicked tooltips: " + str(tooltip_clicks) + "\n"

        if profile_visits > 0:
            file += "-Visited profile page: " + str(profile_visits) + "\n"

        if total_challenges_completed > 0:
            file += "-Completed challenges: " + str(total_challenges_completed) + "\n"
            file += "--Total found: " + str(total_issues_found) + "\n"
            file += "--Total missed: " + str(total_issues_missed) + "\n"
            file += "--Total mistakes: " + str(total_issues_mistakes) + "\n"

        return file

    def analyze_internalisation(self, std_inter_changes):
        file = "\n###The rate of internalisation of the standards\n"

        for key in std_inter_changes:
            std = std_inter_changes[key]
            file += key + " :\n"

            date = ""
            std_text = ""

            for stamp in reversed(std):
                if date == "":
                    date = stamp["date"][0:10]
                    std_text = "  " + date + ": was at score " + str(stamp["score"]) + "\n" + std_text

                elif date != stamp["date"][0:10]:
                    date = stamp["date"][0:10]
                    std_text = "  " + date + ": was at score " + str(stamp["score"]) + "\n" + std_text
            file += std_text


        return file

