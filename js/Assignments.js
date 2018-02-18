/**Model of User info sends information to the server and updates
*  the view depending on what is returned (e.g. signs in or error)**/
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
            if (messageType === app.net.messageHandler.types.TEACHER_ASSIGNMENTS_CREATION_SUCCESSFUL ||
                messageType === app.net.messageHandler.types.GET_ASSIGNMENTS_SUCCESSFUL ||
                messageType === app.net.messageHandler.types.ASSIGNMENT_DELETE_SUCCESSFUL)
            {
                this.assignments = [];
                for (var i = 0; i < data.length; i++)
                {
                    var assignment = new Assignment(data[i]);
                    this.assignments.push(assignment);
                }
            }

            if (messageType === app.net.messageHandler.types.SIGN_IN_SUCCESSFUL)
            {
                this.getAllAssignment();
            }

        }

        // updates views
        this.notify(messageType);
    }

    createAssignment(name, deadlineTime, deadlineDate, description)
    {
        var data = {};
        data.name = name;
        data.deadline_time = deadlineTime;
        data.deadline_date = deadlineDate;
        data.description = description;

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

    submitAssignment(assignmentID, githubLink)
    {
        var data = {};
        // Get userID
        data.user_id = app.user.id;
        data.assignment_id = assignmentID;
        data.github_link = githubLink;

        app.net.sendMessage("submit_assignment", data);

    }
}
