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
        this.totalChallenges = 0;
        this.challengeChain = [];
        this.challengeChainPerformance = [];
        this.lastChallenge = false;

        this.standardInternalisationScore = {};
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
        app.tracker.saveForLogs("challenge started", this.currentChallengeLink);
    }

    saveResults(resutlDict)
    {
        resutlDict.id = this.challengeChain[this.currentChallengeLink-1].id;
        this.challengeChainPerformance.push(resutlDict);
    }

    getChallengeChain(language)
    {
        var parameterPack = {};

        //Some variables to be later received as parameters
        parameterPack.length = 5;
        parameterPack.language = language;

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


            }

            if (messageType === app.net.messageHandler.types.GET_CHALLENGE_CHAIN_SUCCESSFUL)
            {
                this.challengeChainPerformance = [];
                this.challengeChain = data;
                this.currentChallengeLink = 0;
                this.lastChallenge = false;
                this.totalChallenges = data.length;


                this.getChallenge();

                app.viewManager.goToView(app.viewManager.VIEW.CHALLENGE);
                document.getElementById("view-title").innerText = "Complete the challenge";
                app.tracker.saveForLogs("challenge chain started", "");
            }


        }

        this.notify(messageType);
    }

    scoreStandardInternalisation(std, score)
    {
         //this.categoryInternalisationScore
        if (!(std.category in this.standardInternalisationScore))
        {
            this.standardInternalisationScore[std.category] = [];
        }

        var catArr = this.standardInternalisationScore[std.category];
        var stdPresent = false;
        for (var i = 0; i < catArr.length; i++)
        {
            if (catArr[i].standard.subCategory === std.subCategory)
            {
                catArr[i].score +=score;
                stdPresent = true;
            }
        }

        if (!stdPresent)
        {
            var scoreData = {};
            scoreData.standard = std;
            scoreData.score = score;
            this.standardInternalisationScore[std.category].push(scoreData);
        }
    }


    calculateScore(usersIssues)
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
            if (tokenKey in usersIssues)
            {
                // If issue's review matches with the challenge's review.
                if (originalIssues[tokenKey].review === usersIssues[tokenKey].review)
                {
                    foundIssues[tokenKey] = usersIssues[tokenKey];
                    this.scoreStandardInternalisation( usersIssues[tokenKey].standard, usersIssues[tokenKey].standard.rewardScore);
                }

                else
                {
                    falseIssues[tokenKey] = originalIssues[tokenKey];
                    this.scoreStandardInternalisation( usersIssues[tokenKey].standard, -usersIssues[tokenKey].standard.penaltyScore);
                }
            }

            else
            {
                missedIssues[tokenKey] = originalIssues[tokenKey];
                this.scoreStandardInternalisation( originalIssues[tokenKey].standard, -originalIssues[tokenKey].standard.penaltyScore / 2);
            }
        }

        //Get all false issuesFound from user.
        for (var tokenKey in usersIssues)
        {
              //Check if the same token present in issuesFound found.
            if (!(tokenKey in foundIssues || tokenKey in falseIssues || tokenKey in missedIssues))
            {
                falseIssues[tokenKey] = usersIssues[tokenKey];
                this.scoreStandardInternalisation( usersIssues[tokenKey].standard,  -usersIssues[tokenKey].standard.penaltyScore / 2);
            }
        }

        var missedIssuesCount = Object.keys(missedIssues).length;
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

        data.standardInterScore = "";
        var sis = this.standardInternalisationScore;

        for (var cat in sis)
        {
            var categoryString = cat + ": ";
            var subCategoryString = "";

            var categoryScoreDelta = 0;

            sis[cat].sort(function(a,b) {
                if (a.standard.number < b.standard.number) return -1;
                if (a.standard.number > b.standard.number) return 1;
                return 0;
            });

            for (var i = 0; i < sis[cat].length; i++) {
                var subcat = sis[cat][i];
                var userSTDSkill = app.standards.getSTDSubcategorySkill(this.language, cat, subcat.standard.subCategory);

                var curSubCatLevelStr = "&nbsp;&nbsp;&nbsp;&nbsp;(" + userSTDSkill.score + "/" + userSTDSkill.maxScore + ")";

                categoryScoreDelta += subcat.score;
                subCategoryString += ("&nbsp;&nbsp;&nbsp;&nbsp;" + subcat.standard.number + ":"); //+ ": " + sis[cat][i].score + "<br>");

                if (userSTDSkill.score === userSTDSkill.maxScore && subcat.score > -1)
                {
                    subCategoryString += " Reached maximum";
                }

                else
                {
                    if (subcat.score > 0) subCategoryString += ("&nbsp;&nbsp;+" + subcat.score);
                    else subCategoryString += ("&nbsp;&nbsp;" + subcat.score);

                    if (Math.abs(subcat.score) === 1) subCategoryString += " point";
                    else subCategoryString += " points";
                }

                subCategoryString += curSubCatLevelStr + "<br>";
            }


            if (categoryScoreDelta === 0) categoryString += "Did not improve";

            else if (categoryScoreDelta > 0) categoryString += "Has improved by "+ categoryScoreDelta;
            else if (categoryScoreDelta < 0) categoryString += "Has worsened by "+ Math.abs(categoryScoreDelta);

            if (Math.abs(categoryScoreDelta) === 1) categoryString += " point";
            else categoryString += " points";


             var curCatScoreData = app.standards.getCategoryScoreData(this.language, cat);

            categoryString += "&nbsp;&nbsp;&nbsp;&nbsp;(" +curCatScoreData.score + "/" + curCatScoreData.maxScore + ")<br>";



            categoryString += subCategoryString;
            data.standardInterScore += categoryString;
        }
        this.standardInternalisationScore = {};

        app.tracker.saveForLogs("challenge chain completed",
			{"score": data.gradeOverall});

        return data;
    }

    changeStdInternalisation()
    {
        app.standards.updateInternalisationSkillTree(this.standardInternalisationScore, this.language)
    }


    submitChallengeResults()
    {
        // save challenge performance
        var data = {};

        data.email = app.user.email;
        data.challenges_performance = this.challengeChainPerformance;

        app.net.sendMessage("upload_challenge_results", data);
    }










}
