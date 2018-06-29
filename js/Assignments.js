class Assignments extends Model
{
    constructor()
    {
        super();
        this.assignments = [];
    }


    update(data, messageType)
    {
        if (data !== "" && !Number.isInteger(data))
        {
            if (   messageType === app.net.messageHandler.types.TEACHER_ASSIGNMENTS_CREATION_SUCCESSFUL ||
                        messageType === app.net.messageHandler.types.GET_ASSIGNMENTS_SUCCESSFUL ||
                        messageType === app.net.messageHandler.types.ASSIGNMENT_DELETE_SUCCESSFUL)
            {
                this.assignments = [];
                for (var i = 0; i < data.length; i++)
                {
                    this.assignments.push( new Assignment(data[i]));
                }
            }
        }

        // updates views
        this.notify(messageType);
    }

    createAssignment(name, deadlineTime, deadlineDate,reviewTillTime, reviewTillDate,  description, reviewersAmount)
    {
        var data = {};
        data.name = name;
        data.deadline_time = deadlineTime;
        data.deadline_date = deadlineDate;
        data.description = description;
        data.review_till_date = reviewTillDate;
        data.review_till_time = reviewTillTime;
        data.reviewers_amount = reviewersAmount;
        data.status = "normal";


        app.net.sendMessage("add_assignment", data);
    }

    getAllAssignment()
    {
        app.net.sendMessage("get_assignments", {});
    }

    deleteAssignment(id)
    {
        app.net.sendMessage("delete_assignment", {"id":id});
    }

    submitAssignment(assignmentID, filesSubmitted)
    {
        var data = app.submissions.getIfSubmitted( assignmentID, app.user.id);

        if (Object.keys(data).length === 0)
        {
            data.user_id = app.user.id;
            data.assignment_id = assignmentID;
            data.submission_data = filesSubmitted;
            data.is_complete = 0;

            data.iteration = 1;
            data.reviewers_ids = [];
            data.feedbacks = [];
        }

        else
        {
            for (var i = 0; i < this.assignments.length; i++)
            {
                if (this.assignments[i].id === assignmentID && (this.assignments[i].status === "review" || this.assignments[i].status === "review_end_soon" ))
                {
                    data.iteration++;
                }

            }


            data.submission_data = filesSubmitted;
        }


        app.net.sendMessage("submit_assignment", data);
    }
}
