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
                messageType === app.net.messageHandler.types.GET_ASSIGNMENTS_SUCCESSFUL)
            {
                for (var i = 0; i < data.length; i++)
                {
                    var assignment = new Assignment();
                    assignment.deserialise(data[i]);
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
        var assignment = new Assignment(name, deadlineTime, deadlineDate, description);
        app.net.sendMessage("add_assignment", assignment.serialise());
    }

    getAllAssignment()
    {
        app.net.sendMessage("get_assignments", {});
    }

}
