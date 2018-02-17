import datetime

from user_manager import UserManager
from assessments_manager import AssessmentsManager
from email_system import EmailSystem


class CheckAssessmentTime():
    def __init__(self):
        self.current_datetime = datetime.datetime.now()
        self.assessments_manager = AssessmentsManager()

    def update(self):
        deadlines = self.assessments_manager.get_deadlines()[1]
        for deadline in deadlines:
            if deadline["status"] == "Normal":
                next_deadline_time = datetime.datetime.strptime(deadline["date_time"],
                                                                '%Y-%m-%dT%H:%M')
                time_remaining = next_deadline_time - datetime.datetime.now()
                if time_remaining < datetime.timedelta(hours=1):
                    self.assessments_manager.trigger_one_hour_reminder(deadline)

            elif deadline["status"] == "Due Soon":
                next_deadline_time = datetime.datetime.strptime(deadline["date_time"],
                                                                    '%Y-%m-%dT%H:%M')
                time_remaining = next_deadline_time - datetime.datetime.now()
                if time_remaining < datetime.timedelta(hours=0):
                    self.assessments_manager.trigger_deadline_reached(deadline)
                    self.assessments_manager.assign_reviewers_to_projects()

            elif deadline["status"] == "Review":
                self.assessments_manager.watch_review_processes()









check_time = CheckAssessmentTime()

def update():
    check_time.update()
