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

        this.currentChallengeLink = 0;
        this.challengeChain = [];
        this.challengeChainPerformance = [];
        this.lastChallenge = false;

        this.categoryInternalisationScore = {};
    }


    getChallenge()
    {
        this.code = "";
        this.issues = {};

        app.net.sendMessage("get_challenge", this.challengeChain[this.currentChallengeLink]);
        this.currentChallengeLink++;

        if (this.currentChallengeLink === this.challengeChain.length)
        {
             this.lastChallenge = true;
        }

    }

    saveChallengeResults(resutlDict)
    {
        resutlDict.id = this.challengeChain[this.currentChallengeLink-1].id;
        this.challengeChainPerformance.push(resutlDict);
    }

    getChallengeChain()
    {
        var parameterPack = {};

        //Some variables to be later received as parameters
        parameterPack.length = 4;
        var randLanguage = app.utils.getRandomInt(2);
        var keys = Object.keys(app.standards.standardsInfo);
        parameterPack.language = keys[ keys.length * Math.random() << 0];


        app.net.sendMessage("get_challenge_chain", parameterPack);
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

        this.code = "";
        this.issues = {};
        this.averageTimeSeconds = 0;
        this.standard = "";
        this.language = "";
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

                //if (this.currentChallengeLink === 1)
                //{
                    //app.viewManager.goToView(app.viewManager.VIEW.CHALLENGE);
                  //  document.getElementById("view-title").innerText = "Complete the challenge";
                //}
            }

            if (messageType === app.net.messageHandler.types.GET_CHALLENGE_CHAIN_SUCCESSFUL)
            {
                this.challengeChainPerformance = [];
                this.challengeChain = data;
                this.currentChallengeLink = 0;
                this.lastChallenge = false;
                this.getChallenge();

                app.viewManager.goToView(app.viewManager.VIEW.CHALLENGE);
                document.getElementById("view-title").innerText = "Complete the challenge";
            }


        }

        this.notify(messageType);
    }

    scoreCategoryInternalisation(category, score)
    {
         //this.categoryInternalisationScore
        if (!(category in this.categoryInternalisationScore))
        {
            this.categoryInternalisationScore[category] = 0;
        }
        this.categoryInternalisationScore[category] += score;
    }


    calculateScore(issuesFound)
    {
        var totalIssues = Object.keys(this.issues).length;
        var originalIssues = this.issues;

        var foundIssues = {};
        var falseIssues = {};
        var missedIssues = {};



        // Identify all issuesFound from the original issuesFound.
        for (var tokenKey in originalIssues)
        {


            //Check if the same token present in issuesFound found.
            if (tokenKey in issuesFound)
            {
                // If issue's review matches with the challenge's review.
                if (originalIssues[tokenKey].review === issuesFound[tokenKey].review)
                {
                    foundIssues[tokenKey] = issuesFound[tokenKey];
                    this.scoreCategoryInternalisation( issuesFound[tokenKey].review.split("->")[0], 1);

                }

                else
                {
                    falseIssues[tokenKey] = originalIssues[tokenKey];
                    this.scoreCategoryInternalisation( issuesFound[tokenKey].review.split("->")[0], -1);

                }
            }

            else
            {
                missedIssues[tokenKey] = originalIssues[tokenKey];
                this.scoreCategoryInternalisation( originalIssues[tokenKey].review.split("->")[0], -.5);
            }
        }

        //Get all false issuesFound from user.
        for (var tokenKey in issuesFound)
        {
              //Check if the same token present in issuesFound found.
            if (!(tokenKey in foundIssues || tokenKey in falseIssues || tokenKey in missedIssues))
            {
                falseIssues[tokenKey] = issuesFound[tokenKey];
                this.scoreCategoryInternalisation( issuesFound[tokenKey].review.split("->")[0], -1);
            }
        }


        var foundIssuesCount = Object.keys(foundIssues).length;
        var falseIssuesCount = Object.keys(falseIssues).length;

        var score = (foundIssuesCount/totalIssues) * 100;
        score -= falseIssuesCount * 15;
        if (score < 0)
        {
            score = 0;
        }


        return score;
    }

    getOverallPerformance()
    {
        var data = {};
        data.gradeOverall = 0;
        data.timeOverall = 0;

        data.gradeCumulativeStr = "(";
        data.timeCumulativeStr = "(";

        data.grades = [];
        data.time = [];

        var perf = this.challengeChainPerformance;
        for (var i = 0; i < perf.length; i++)
        {
            data.grades.push(perf[i].grade);
            data.time.push(perf[i].time);
            data.gradeOverall += perf[i].grade;
            data.timeOverall += perf[i].time;
            data.gradeCumulativeStr += " " + perf[i].grade;
            data.timeCumulativeStr += " " + perf[i].time;

            if (i+1 < perf.length)
            {
                data.gradeCumulativeStr +=  "% +";
                data.timeCumulativeStr += "s +";
            }
            else
            {
                data.gradeCumulativeStr += "% )";
                data.timeCumulativeStr += "s )";
            }
        }
        data.gradeOverall /= perf.length;

        data.categoryInterScore = "";
        var cis = this.categoryInternalisationScore;

        for (var cat in cis)
        {
            var str = cat + ": ";
            var score = cis[cat];

            if (score === 0)
            {
                str += "Did not improve<br>";
                //str = str.fontcolor("yellow");
            }
            if (score > 0)
            {
                str += "Has improved by "+ score +" points<br>";
                //str = str.fontcolor("green");
            }
            if (score < 0)
            {
                str += "Has worsened by "+ score +" points<br>";
                //str = str.fontcolor("dark orange");
            }

             data.categoryInterScore += str;
        }
        this.categoryInternalisationScore = {};

        return data;
    }


}
