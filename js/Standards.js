class Standards extends Model {
    constructor() {
        super();
        this.standards = [];
    }


    update(data, messageType) {
      /*  if (messageType === app.net.messageHandler.types.SUBMIT_ASSIGNMENT_SUCCESSFUL ||
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

        this.notify(messageType);*/
    }
}