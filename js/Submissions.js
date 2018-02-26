class Submissions extends Model {
    constructor() {
        super();
        this.submissions = [];
        this.assignmentNames = {};

        // it will regulate what user will be able to do with the submission in the code view.
        // Values:
        // Clear - code only
        // Comments - code and comments (no review mechanisms)
        // Review - code and review ability
        this.codeViewState = "Clear";
        this.submissionIDToCodeView = -1;
    }

    retrieveAssignmentNames(model)
    {
        for (var i = 0; i < model.assignments.length; i++)
        {
            this.assignmentNames[ model.assignments[i].id] =  model.assignments[i].name;
        }
    }

    submitReview(allFilesReview)
    {
        var data = {};
        data.review = allFilesReview;
        data.reviewer_id = app.user.id;
        data.reviewer_role = app.user.role;
        data.submission_id = this.submissionIDToCodeView;

        app.net.sendMessage("submit_review", data);
    }

    update(data, messageType)
    {
        if (    messageType === app.net.messageHandler.types.SUBMIT_ASSIGNMENT_SUCCESSFUL ||
                messageType === app.net.messageHandler.types.GET_SUBMISSIONS_SUCCESSFUL)
        {
            this.submissions = [];
            for (var i = 0; i < data.length; i++)
            {
                this.submissions.push(new Submission(data[i]));
            }
        }


        this.notify(messageType);
    }

    getPersonalSubmissions(id)
    {
        var userID = id;
        app.net.sendMessage("get_submissions", {"user_id":userID});
    }

    getAllSubmissions(){

        app.net.sendMessage("get_all_submissions",{});
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