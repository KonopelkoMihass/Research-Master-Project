class Submission
{
    constructor(data)
    {
        this.id = data.id;
        this.userID = data.user_id;
        this.assignmentID = data.assignment_id;
        this.submissionData = data.submission_data;
        this.isComplete = data.is_complete;
        this.iteration = data.iteration;
        this.reviewersIDs = data.reviewers_ids;
        this.feedbacks = data.feedbacks;

        this.userData = {};
        if(data.user_data)
        {
            this.userData = data.user_data;
        }

    }

    serialize()
    {
        var data = {};

        data.id = this.id;
        data.user_id = this.userID;
        data.assignment_id = this.assignmentID;
        data.submission_data = this.submissionData;
        data.is_complete = this.isComplete;
        data.iteration = this.iteration;
        data.reviewers_ids = this.reviewersIDs;
        data.feedbacks = this.feedbacks;

        return data;

    }
}
