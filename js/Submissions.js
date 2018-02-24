class Submissions extends Model {
    constructor() {
        super();
        this.submissions = [];
    }


    update(data, messageType) {
        if (messageType === app.net.messageHandler.types.SUBMIT_ASSIGNMENT_SUCCESSFUL ||
            messageType === app.net.messageHandler.types.GET_SUBMISSIONS_SUCCESSFUL)
        {
            this.submissions = [];
            for (var i = 0; i < data.length; i++)
            {
                var submission = new Submission(data[i]);
                this.submissions.push(submission);
            }
        }
        else if (messageType === app.net.messageHandler.types.SIGN_IN_SUCCESSFUL)
        {
            this.getSubmissions(data.id);
        }

        this.notify(messageType);
    }

    getSubmissions(id)
    {
        var userID = id;
        app.net.sendMessage("get_submissions", {"user_id":userID});
    }

    getIfSubmitted(assignmentID, userID)
    {
        for (var i = 0; i < this.submissions.length;i++)
        {
            let sub = this.submissions[i];
            if (sub.assignmentID === assignmentID && sub.userID === userID)
            {
                return this.submissions[i].serialize();
            }
        }
        return {};
    }

}