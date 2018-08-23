class Challenge extends Model
{
    constructor()
    {
        super();
        this.code = "";
        this.issues = {};
        this.startTime = 0;

        this.averageTimeSeconds = 0;
        this.standard = "";
        this.language = "";
    }


    addCodeContent(content)
    {
        this.code = content;
    }

    removeCodeContent()
    {
        this.code = "";
    }

    storeIssues(issues)
    {
        this.issues = issues;
    }

    storeParameters(minutes, seconds, standard, language)
    {
        this.averageTimeSeconds = parseInt(minutes)*60 + parseInt(seconds);
        this.standard = standard;
        this.language = language;
    }


    submitChallenge()
    {
        var data = {};
        data.code = this.code;
        data.issues = this.issues;
        data.average_time_seconds = this.averageTimeSeconds;
        data.standard = this.standard;
        data.language = this.language;


        app.net.sendMessage("create_challenge", data);
    }



    update(data, messageType)
    {
        if (data !== "" && !Number.isInteger(data))
        {
             if (messageType === app.net.messageHandler.types.TEACHER_CREATE_CHALLENGE_SUCCESSFUL ||
                 messageType === app.net.messageHandler.types.TEACHER_CREATE_CHALLENGE_FAILED)
             {

             }

             if (messageType === app.net.messageHandler.types.GET_CHALLENGE_SUCCESSFUL)
             {
                 this.code = data.code;
                 this.issues = data.issues;
                 this.averageTimeSeconds = data.average_time_seconds;
                 this.standard = data.standard;
                 this.language = data.language;

				 app.viewManager.goToView(app.viewManager.VIEW.CHALLENGE);
				 document.getElementById("view-title").innerText = "Complete the challenge";

             }
        }

        this.notify(messageType);
    }

    getChallenge()
    {
        this.code = "";
        this.issues = {};
        app.net.sendMessage("get_challenge", {});
    }


    calculateScore(issuesFound)
    {
        var totalIssues = Object.keys(this.issues).length;
        var originalIssues = this.issues;

        var foundIssues = {};
        var falseIssues = {};
        var missedIssues = {};

        // Identify all issues from the original issues.
        for (var tokenKey in originalIssues)
        {
            //Check if the same token present in issues found.
            if (tokenKey in issuesFound)
            {
                // If issue's review matches with the challenge's review.
                if (originalIssues[tokenKey].review === issuesFound[tokenKey].review)
                {
                    foundIssues[tokenKey] = originalIssues[tokenKey];
                }

                else
                {
                    falseIssues[tokenKey] = originalIssues[tokenKey];
                }
            }

            else
            {
                missedIssues[tokenKey] = originalIssues[tokenKey];
            }
        }

        //Get all false issues from user.
        for (var tokenKey in issuesFound)
        {
              //Check if the same token present in issues found.
            if (!(tokenKey in foundIssues || tokenKey in falseIssues || tokenKey in missedIssues))
            {
                falseIssues[tokenKey] = issuesFound[tokenKey];
            }
        }

        console.log("foundIssues", foundIssues);
        console.log("falseIssues", falseIssues);
        console.log("missedIssues", missedIssues);

        var foundIssuesCount = Object.keys(foundIssues).length;
        var falseIssuesCount = Object.keys(falseIssues).length;


        var score = (foundIssuesCount/totalIssues) * 100;
        score -= falseIssuesCount * 15;
        return score;
    }
}
