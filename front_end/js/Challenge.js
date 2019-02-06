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
        this.difficulty = "";

        this.challengeIssueInformationName = [];
        this.challengeIssueInformationDescription = [];

        this.standardInternalisationScore = {};
        this.doingChallenge = false;
    }

    getChallengeId()
    {
        return this.challengeChain[this.currentChallengeLink-1];
    }


    doesContainThisStandardCategory(category){

        for (var codeline in this.issues)
        {
            var std = this.issues[codeline];
            if (std.standard.category === category)
            {
                return true;
            }
        }

        return false;
    }

    doesContainThisStandardSubCategory(subcategoryNumber){
        for (var codeline in this.issues)
        {
            var std = this.issues[codeline];
            if (std.standard.number === subcategoryNumber)
            {
                 return true;
            }
        }
        return false;
    }



    getChallenge()
    {
        this.code = "";
        this.issues = {};
        var dataToSend = this.challengeChain[this.currentChallengeLink];

        if (dataToSend === undefined) {
            var scoreData = app.standards.getOverallStandardProgression(this.language);
            var currentScorePack = scoreData.score;
            var currentMaxPack = scoreData.max;

            var percentage = Math.ceil((currentScorePack.total / currentMaxPack.total) * 100);
            if (percentage === 100){
                alert("You have mastered the standards!  To practice specific standards, select them as \"Focus\" in profile.");
            }
            else {
                alert("There appears to be some error... contact the research supervisor");
            }

        }
        else{
            app.net.sendMessage("get_challenge", dataToSend);
            this.currentChallengeLink++;

            if (this.currentChallengeLink === this.challengeChain.length)
            {
                 this.lastChallenge = true;
            }
            app.annalist.saveForLogs("challenge started", this.currentChallengeLink);
        }
    }

    saveResults(resutlDict)
    {
        resutlDict.id = this.challengeChain[this.currentChallengeLink-1];
        this.challengeChainPerformance.push(resutlDict);
    }

    getChallengeChain(language)
    {
        var parameterPack = {};

        //Some variables to be later received as parameters
        parameterPack.length = 4;
        parameterPack.language = language;
        this.language = language;

        var allFocuses = app.user.focus;
        var focusesForThisLanguage = [];
        for (var key in allFocuses) {
            if ( app.standards.getSubcategoryLanguage(allFocuses[key].number, allFocuses[key].category )  === language) {
                focusesForThisLanguage.push(allFocuses[key]);
            }
        }

        parameterPack.focus = focusesForThisLanguage;
        parameterPack.gamified = app.user.gamified;
        parameterPack.std_internalisation = app.user.stdInternalisation[language];

        parameterPack.user_level = app.user.calculateLevel(language);

        if (!Number.isInteger(parameterPack.user_level))
            parameterPack.user_level = 1;

        if (parameterPack.std_internalisation == undefined){
            parameterPack.std_internalisation = {};
        }

        var stdsToExam = app.user.standardsReadyForExam(language);
        var isExamTime = stdsToExam.length ? true : false;

        parameterPack.is_exam = isExamTime;
        parameterPack.stds_to_exam = JSON.stringify(stdsToExam);



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

    storeParameters(minutes, seconds, standard, language, difficulty)
    {
        this.averageTimeSeconds = parseInt(minutes)*60 + parseInt(seconds);
        this.standard = standard;
        this.language = language;
        this.difficulty = difficulty;
    }


    submitChallenge()
    {
        var data = {};
        data.code = this.code;
        data.issues = this.issues;
        data.average_time_seconds = this.averageTimeSeconds;
        data.standard = this.standard;
        data.language = this.language;
        data.difficulty =  this.difficulty;

        app.net.sendMessage("create_challenge", data);

        this.code = "";
        this.issues = {};
        this.averageTimeSeconds = 0;
        this.standard = "";
        this.language = "";
        this.difficulty = "";
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
                this.challengeIssueInformationName = [];
                this.challengeIssueInformationDescription = [];

                this.code = data.code;
                this.issues = data.issues;
                this.averageTimeSeconds = data.average_time_seconds;
                this.standard = data.standard;
                this.language = data.language;


                if (data.difficulty === "hard") this.difficulty = "exam";
                else
                {
                    var familiarIssue = "";
                    for (var key in this.issues)
                    {
                        var lvl = app.user.getSubcategoryScore(
                            this.language,
                            this.issues[key].standard.category ,
                            this.issues[key].standard.number);


                        if (lvl >= 4 ) {
                            familiarIssue = "You have seen it often to find on your own";
                        }
                        else {
                            this.challengeIssueInformationName.push(this.issues[key].standard.category + "->" + this.issues[key].standard.subCategory);
                            this.challengeIssueInformationDescription.push(this.issues[key].standard.description);
                        }
                    }

                    // Remove duplicates.
                    this.challengeIssueInformationName = [...new Set(this.challengeIssueInformationName)];
                    this.challengeIssueInformationDescription = [...new Set(this.challengeIssueInformationDescription)];


                    // Add "FamiliarIssue" note if present
                    if (familiarIssue !== ""){
                        if (this.challengeIssueInformationName.size > 0) {
                            this.challengeIssueInformationName.unshift(familiarIssue);
                            this.challengeIssueInformationDescription.unshift(familiarIssue);
                            this.difficulty = "mixed";
                        }
                        else {
                            this.challengeIssueInformationName.push(familiarIssue);
                            this.challengeIssueInformationDescription.push(familiarIssue);
                            this.difficulty = "hard";
                        }
                    }

                    else {
                         this.difficulty = "easy";
                    }
                }
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
                app.annalist.saveForLogs("challenge chain started", "");
            }

            if (messageType === app.net.messageHandler.types.GO_TO_GOOGLE_SHEET_SUCCESSFUL){
                window.open( data.link, '_blank');
                //location.href = data.link;
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

                var scoreBeforeChallenges = app.user.getSubcategoryScore(catArr[i].standard.name, catArr[i].standard.category, catArr[i].standard.number);

                if (scoreBeforeChallenges + catArr[i].score > 10)
                {
                    catArr[i].score = 10 - scoreBeforeChallenges;

                    if (app.user.getSubcategoryLearnState(catArr[i].standard.name, catArr[i].standard.category, catArr[i].standard.number) === "Learning")
                    {
                        catArr[i].score--;
                    }

                    if (app.user.getSubcategoryLearnState(catArr[i].standard.name, catArr[i].standard.category, catArr[i].standard.number) === "Exam Ready")
                    {
                        catArr[i].score = 1;
                    }

                }
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
            data.grades.push(Math.round(perf[i].grade));
            data.time.push(perf[i].time);
            data.gradeOverall += Math.round(perf[i].grade);
            data.timeOverall += perf[i].time;
            data.gradeCumulativeStr += " " + (Math.round(perf[i].grade));

            var challengeTimeMins = Math.floor(perf[i].time/60);
            var challengeTimeSecs = perf[i].time%60;
            if (challengeTimeMins!==0){
                 data.timeCumulativeStr += " " + challengeTimeMins + "m ";
            }
             data.timeCumulativeStr += " " + challengeTimeSecs;


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
        data.gradeOverall = (data.gradeOverall/perf.length).toFixed(0);


        // Store initial scores, new scores and std data
        var sis = this.standardInternalisationScore;

        var stdData = {};
        for (var cat in sis)
        {
            stdData[cat] = [];

            sis[cat].sort(function(a,b) {
                if (a.standard.number < b.standard.number) return -1;
                if (a.standard.number > b.standard.number) return 1;
                return 0;
            });

            for (var i = 0; i < sis[cat].length; i++) {

                var subcat = sis[cat][i];
                var userSTDSkill = app.standards.getSTDSubcategorySkill(this.language, cat, subcat.standard.number);

                var stdSubcatData = {};
                stdSubcatData.category = cat;
                stdSubcatData.number = subcat.standard.number;
                stdSubcatData.subCategory = subcat.standard.subCategory;
                stdSubcatData.currentScore = Math.floor(userSTDSkill.score);

                stdSubcatData.newScore = Math.floor(userSTDSkill.score + subcat.score);
                if (stdSubcatData.newScore < 0 ){stdSubcatData.newScore = 0;}
                else if (stdSubcatData.newScore > 10){ stdSubcatData.newScore = 10;}

                stdSubcatData.scoreIncrement = subcat.score;

                if(subcat.score < 0)
                    stdSubcatData.scoreIncrementSign = "-";
                else if (userSTDSkill.score !== 10)
                    stdSubcatData.scoreIncrementSign ="+";

                stdData[cat].push(stdSubcatData);

            }
        }
        data.stdProgress = stdData;


        app.annalist.saveForLogs("challenge chain completed", {"score": data.gradeOverall});


        // Recalculate time
        let timeOveralStr = "" + Math.floor(data.timeOverall/60) + "m ";
        timeOveralStr += data.timeOverall%60 + "s";
        data.timeOverall = timeOveralStr;

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
