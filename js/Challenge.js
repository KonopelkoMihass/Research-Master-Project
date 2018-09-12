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

    }

    saveResults(resutlDict)
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

        // this.subCategoryInternalisationScore


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
                    this.scoreStandardInternalisation( usersIssues[tokenKey].standard, 1);
                }

                else
                {
                    falseIssues[tokenKey] = originalIssues[tokenKey];
                    this.scoreStandardInternalisation( usersIssues[tokenKey].standard, -1);
                }
            }

            else
            {
                missedIssues[tokenKey] = originalIssues[tokenKey];
                this.scoreStandardInternalisation( originalIssues[tokenKey].standard, -.5);
            }
        }

        //Get all false issuesFound from user.
        for (var tokenKey in usersIssues)
        {
              //Check if the same token present in issuesFound found.
            if (!(tokenKey in foundIssues || tokenKey in falseIssues || tokenKey in missedIssues))
            {
                falseIssues[tokenKey] = usersIssues[tokenKey];
                this.scoreStandardInternalisation( usersIssues[tokenKey].standard, -1);
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

        data.standardInterScore = "";



        // this.standardInternalisationScore[std.category][std.subCategory]

        var sis = this.standardInternalisationScore;


        for (var cat in sis)
        {
            var str = cat + ": ";
            var str2 = "";
            var score = 0;

            sis[cat].sort(function(a,b) {
                if (a.standard.number < b.standard.number) return -1;
                if (a.standard.number > b.standard.number) return 1;
                return 0;
            });





            for (var i = 0; i < sis[cat].length; i++)
            {
                score += sis[cat][i].score;
                str2 += ("&nbsp;&nbsp;&nbsp;&nbsp;" + sis[cat][i].standard.number + ":"); //+ ": " + sis[cat][i].score + "<br>");

                if (sis[cat][i].score > 0)
                {
                     str2 += ("&nbsp;&nbsp;+" + sis[cat][i].score);
                }
                else
                {
                    str2 += ("&nbsp;&nbsp;" + sis[cat][i].score);
                }



                if (Math.abs(sis[cat][i].score) === 1)
                {
                    str2 += " point<br>";
                }
                else{
                    str2 += " points<br>";
                }
            }


            if (score === 0)
            {
                str += "Did not improve<br>";
            }

            if (score > 0)
            {
                str += "Has improved by "+ score;
            }
            else if (score < 0)
            {
                str += "Has worsened by "+ Math.abs(score);
            }

            if (Math.abs(score) === 1)
            {
                str += " point<br>";
            }
            else
            {
                str += " points<br>";
            }











            str += str2;

             data.standardInterScore += str;
        }
        this.standardInternalisationScore = {};

        return data;
    }


}
