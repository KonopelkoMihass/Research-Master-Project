import datetime

#from user_manager import UserManager
from assignments_manager import AssignmentsManager
#from email_system import EmailSystem
from database_manager import DatabaseManager


class CheckAssignmentStage():
    def __init__(self):
        self.assignments_manager = AssignmentsManager()
        self.database_manager = DatabaseManager()

    def update(self):
        #print("##########################################")
        #print("DAEMON IS UPDATED")
        #print("##########################################")

        update_clients = False

        #Thsi method returns a message pack (type, data).  We need data
        assignments = self.assignments_manager.get_assignments()[1]
        for assignment in assignments:
            status = assignment["status"]
            old_status = status
            deadline_string = assignment["deadline_date"] + "T" + assignment["deadline_time"]
            review_till_string = assignment["review_till_date"] + "T" + assignment["review_till_time"]

            deadline_time = datetime.datetime.strptime(deadline_string, '%Y-%m-%dT%H:%M')
            review_till_time = datetime.datetime.strptime(review_till_string, '%Y-%m-%dT%H:%M')


            if status == "normal":
                time_remaining = deadline_time - datetime.datetime.now()
                if time_remaining < datetime.timedelta(hours=1):
                    status = "submission_soon"
                    #SEND EMAIL
                    pass

            elif status == "review":
                time_remaining = review_till_time - datetime.datetime.now()
                if time_remaining < datetime.timedelta(hours=1):
                    status = "review_end_soon"
                    # SEND EMAIL
                    pass

            elif status == "submission_soon":
                time_remaining = deadline_time - datetime.datetime.now()
                if time_remaining < datetime.timedelta(hours=0):
                    status = "review"
                    self.reviewer_assigning(assignment)
                    update_clients = True
                    # SEND EMAIL

                    pass

            elif status == "review_end_soon":
                time_remaining = review_till_time - datetime.datetime.now()
                if time_remaining < datetime.timedelta(hours=0):
                    status = "completed"
                    update_clients = True


                    # SEND EMAIL
                    pass

            if old_status != status:
                try:
                    assignment["status"] = status
                    self.database_manager.replace_into_table("Assignments", assignment)
                except:
                    pass

        return update_clients



    def reviewer_assigning(self, assignment):
        submissions = self.assignments_manager.get_submissions_for_assignment(assignment["id"])

        submitters = []
        for submission in submissions:
            submitters.append(submission["user_id"])

        total_reviews_to_do = assignment["reviewers_amount"]
        if total_reviews_to_do >= len(submitters):
            total_reviews_to_do = len(submitters) - 1
            #SEND EMAIL

        reviewer_ids = []
        for submission in submissions:
            reviewer_ids.append( [ ] )


        max_clock_offset = len(submissions) - 1
        offset = 1


        for i in range(0, total_reviews_to_do):
            for j in range(0, len(reviewer_ids)):
                reviewer_ids[j].append(submitters[offset])
                offset += 1
                if offset > max_clock_offset:
                    offset = 0
            offset += 1
            if offset > max_clock_offset:
                offset = 0

        for i in range(0, len(submissions)):
            submissions[i]["reviewers_ids"] = reviewer_ids[i]
            del submissions[i]["user_data"]

            try:
                self.assignments_manager.submit_assignment(submissions[i])
                #print("Updated Submission")
            except:
                pass



check_time = CheckAssignmentStage()

def update():
    return check_time.update()
