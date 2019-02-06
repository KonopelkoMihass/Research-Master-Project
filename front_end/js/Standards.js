class Standards extends Model
{
    constructor() {
        super();
        this.standards = {};
        this.standardsInfo = [];
    }


    pushStandards(file)
    {
        app.net.sendMessage("push_standard", {"html_content":file});
    }

    selectStandards(standardName)
    {
        var standardsToUse = {};
        for (var key in this.standards)
        {
            for (var i = 0; i < this.standards[key].length; i++)
            {
                if (this.standards[key][i]["name"] === standardName)
                {
                    if (this.standards[key][i]["category"] in standardsToUse)
                    {
                        standardsToUse[key].push(this.standards[key][i]);
                    }
                    else
                    {
                        standardsToUse[key] = [];
                        standardsToUse[key].push(this.standards[key][i]);
                    }
                }
            }
        }

        return standardsToUse;
    }


    update(data, messageType)
    {
       if (data !== "" && !Number.isInteger(data))
        {
            if ( messageType === app.net.messageHandler.types.GET_STANDARD_SUCCESSFUL)
            {
                this.standardsInfo[data["standard_id"]] = {};
                
                this.standardsInfo[data["standard_id"]]["name"] = data["name"];
                this.standardsInfo[data["standard_id"]]["url"] = data["url"];


                var stdFromServer = data["standard"];

                for (var i = 0; i < stdFromServer.length; i++)
                {
                    if (stdFromServer[i]["category"] in this.standards)
                    {
                        this.standards[stdFromServer[i]["category"]].push(new Standard(stdFromServer[i]));
                    }

                    else
                    {
                        this.standards[stdFromServer[i]["category"]] = [];
                        this.standards[stdFromServer[i]["category"]].push(new Standard(stdFromServer[i]));
                    }

                }
            }
        }

        // updates views
        this.notify(messageType);
    }

    getStandards()
    {
         app.net.sendMessage("get_standard", {});
    }

    getStandardIternalisationLevel(language)
    {
        var userSTD = app.user.stdInternalisation[language];
        var score = 0;
        var maxScore = 0;


        for (var cat in userSTD)
        {
            score += userSTD[cat].score;
            maxScore +=  userSTD[cat].maxScore;
        }
        return [score, maxScore] ;
    }

     standardsReadyForExam(language)
     {
        var userSTD = app.user.stdInternalisation;
        var stdsExamReadyIDs = [];

        if (!userSTD.hasOwnProperty(language)) {
            userSTD[language] = this.addInternalisationSkillTree(language);
            return [];
        }


        var stdsReadyForExam = 0;
        var stdsToLearn = 0;


        for (var cat in userSTD[language]) {
            var currentLevel =  app.user.calculateLevel(language);
            var userSTDIntCategory = userSTD[language][cat];

             for (var i = 0; i < userSTDIntCategory.subcategories.length; i++)
             {
                 var subCat = userSTDIntCategory.subcategories[i];

                 var isAvailable =
                     this.isLevelAllowToSeeThisSubcategory(language, cat, subCat.number, currentLevel);


                 if (subCat.learnState === "Learning"  && subCat.score !== 0 && subCat.score !== 9 && isAvailable)
                     stdsToLearn++;



                 else if
                    ((subCat.learnState === "Exam Ready" && isAvailable) ||
                     (subCat.score === 9 && isAvailable)) {

                     stdsReadyForExam++;
                     stdsExamReadyIDs.push(subCat.number);
                 }
             }
        }

        const MAX_NUM_OF_EXAMS = 4;

        // Case 1 - there are enough stds to start an exam.
        if (stdsReadyForExam >= MAX_NUM_OF_EXAMS) return stdsExamReadyIDs;

        // Case 2 - there are not enough stds to do exams HOWEVER there are at least one std to learn
        else if (stdsReadyForExam < MAX_NUM_OF_EXAMS && stdsToLearn > 0) return [];

        // Case 3 - there are not enough stds to do exams AND no stds to learn.
        else return stdsExamReadyIDs;

     }

    checkIfLearnStatesArePresent()
    {
        var userSTD = app.user.stdInternalisation;
        if (userSTD !== "{}"){
            if (Object.keys(userSTD).length !== 0 )
            {
                for (var language in userSTD)
                {
                    for (var catKey in userSTD[language])
                    {
                        var cat = userSTD[language][catKey];
                        for (var j = 0; j < cat.subcategories.length; j++)
                        {
                            var subcat = cat.subcategories[j];
                            if (!subcat.hasOwnProperty("learnState"))
                            {
                                subcat.learnState = "Learning";
                                if (subcat.score >= 9 && subcat.learnState === "Learning") {
                                    subcat.learnState = "Exam Ready";
                                    subcat.score = 9;
                                }
                            }
                            else {continue;}
                        }
                    }
                }
            }
        }
    }

    updateInternalisationSkillTree(scores, language)
    {
        var userSTD = app.user.stdInternalisation;

        if (!userSTD.hasOwnProperty(language))
        {
            userSTD[language] = this.addInternalisationSkillTree(language);
        }

        for (var cat in scores)
        {
            var userSTDIntCategory = userSTD[language][cat];

            for (var i = 0; i < scores[cat].length; i++)
            {
                var score = parseInt(scores[cat][i].score);
                var std = scores[cat][i].standard;

                var userSubcat = {};

                for (var j = 0; j < userSTDIntCategory.subcategories.length; j++)
                {
                    if (userSTDIntCategory.subcategories[j].number === std.number)
                    {
                        userSubcat = userSTDIntCategory.subcategories[j];
                        break;
                    }
                }

                var overflow = 0;
                if (userSubcat.score + score > userSubcat.maxScore || userSubcat.score + score < 0) {
                    overflow = userSubcat.score + score;
                    if (overflow > userSubcat.maxScore) overflow -= userSubcat.maxScore;
                }

                // add learnState key if not present.
                if (!("learnState" in userSubcat)) userSubcat.learnState = "Learning";

                userSubcat.score += (score - overflow);
                userSTDIntCategory.score += (score - overflow);

                // Manage standard internalisation states and where they can go.
                //
                // If score is 9 or above and state is learning - set score to 9 and state to "Exam Ready"
                if (userSubcat.score >= 9 && userSubcat.learnState === "Learning") {
                    userSubcat.learnState = "Exam Ready";
                    if (userSubcat.score > 9) {
                        userSubcat.score = 9;
                        userSTDIntCategory.score--;
                    }
                }


                else if (userSubcat.score < 9 && userSubcat.learnState === "Exam Ready") userSubcat.learnState = "Learning";
                else if (userSubcat.score > 9 && userSubcat.learnState === "Exam Ready") userSubcat.learnState = "Mastered";
                else if (userSubcat.score < 10 && userSubcat.learnState === "Mastered") userSubcat.learnState = "Learning";


                this.recordTheStdInternalisationChange(cat, userSubcat.name, userSubcat.score);


            }
        }

        // send it
        var data = {};
        data.email = app.user.email;
        data.std_internalisation = userSTD;
        data.std_internalisation_changes = app.user.stdInternalisationChanges;

        app.net.sendMessage("update_skills", data);
    }

    addInternalisationSkillTree(language)
    {
        var stdSkills = {};

        for (var cat in this.standards)
        {
            for (var i = 0; i < this.standards[cat].length; i++)
            {
                var subcat = this.standards[cat][i];
                if (subcat.name === language)
                {
                    if (subcat.category in stdSkills === false)
                    {
                        stdSkills[cat] = {};
                        stdSkills[cat].score = 0;
                        stdSkills[cat].maxScore = 0;
                        stdSkills[cat].subcategories = [];
                    }

                    var subcatSkill = {};
                    subcatSkill.number = subcat.number;
                    subcatSkill.name = subcat.subCategory;
                    subcatSkill.score = 0;
                    subcatSkill.maxScore = 10;
                    subcatSkill.learnState = "Learning";


                    stdSkills[cat].subcategories.push(subcatSkill);
                    stdSkills[cat].maxScore += 10;
                }
            }
        }
        return stdSkills;
    }

    recordTheStdInternalisationChange(cat, subcat, currentScore)
    {
        var stdInternalisationChanges = app.user.stdInternalisationChanges;
        var key = cat + "->" + subcat;

        var date = new Date();
        var pack =
            {
                date: date,
                score: currentScore
            };

        if (!stdInternalisationChanges.hasOwnProperty(key))
        {
            stdInternalisationChanges[key] = [];
        }
        stdInternalisationChanges[key].push(pack);
        app.user.stdInternalisationChanges = stdInternalisationChanges;
    }

    getCategoryScoreData(language, category)
    {
        var d = {};
        d.score = app.user.stdInternalisation[language][category].score;
        d.maxScore = app.user.stdInternalisation[language][category].maxScore;

        var std = this.selectStandards(language);


        for (var i = 0; i < std[category].length; i++)
        {
            if (std[category][i].enabled === "no"){
                d.maxScore -= 10;
            }
        }


        return d;
    }


    getSTDSubcategorySkill(language, category, number)
    {
         var userSTD = app.user.stdInternalisation[language];
         var cat = userSTD[category];

         for (var i = 0; i < cat.subcategories.length; i++)
         {
             if (cat.subcategories[i].number == number)
             {
                return cat.subcategories[i];
             }
         }
    }

    saveStandardConfigurations()
    {
        var data = [];

        for (var k in  this.standards)
        {
            var std = this.standards[k];
            for (var i = 0; i < std.length; i++)
            {
                var config = {};
                config.reward_score = std[i].rewardScore;
                config.penalty_score = std[i].penaltyScore;
                config.unlocked_at_level = std[i].unlockedAtLevel;
                config.enabled = std[i].enabled;
                config.category = std[i].category;
                config.sub_category = std[i].subCategory;
                config.description = std[i].description;
                config.id = std[i].number;
                config.name = std[i].name;

                data.push(config);
            }
        }

        app.net.sendMessage("update_standards_configurations", data);
    }


    checkIfEnabled(standards)
    {
        for (var i = 0; i < standards.length; i++)
        {
           if(standards[i].enabled === "yes") return true;
        }
        return false;
    }

    getStandard(categoryName, number, language)
    {
        var subCategories = this.standards[categoryName];
         for (var j = 0; j < subCategories.length; j++)
         {
             if (subCategories[j].number == number && subCategories[j].name === language) return subCategories[j];
         }
    }

    getOverallStandardProgression(name)
    {
        var std = this.selectStandards(name);
        var userStdInter = app.user.stdInternalisation[name];
        var enabledStandards = [];

        var userCurrentScore = {total:0};
        var userCurrentMax = {total:0};


        for (var k in std)
        {
            userCurrentScore[k] = 0;
            userCurrentMax[k] = 0;

            enabledStandards = [];
            for (var i = 0; i < std[k].length; i++)
            {
                var stdbit = std[k][i];
                if (stdbit.enabled === "yes")
                {
                    enabledStandards.push(stdbit);

                    userCurrentMax[k] += 10;
                    userCurrentMax["total"] += 10;
                }
            }

            for (var i = 0; i < enabledStandards.length; i++)
            {
                var stdEnabledBit = enabledStandards[i];

                for(var j = 0; j < userStdInter[k].subcategories.length; j++)
                {
                    var studentInterStd = userStdInter[k].subcategories[j];

                    if (stdEnabledBit.number ===  studentInterStd.number)
                    {

                        userCurrentScore[k] += studentInterStd.score;
                        userCurrentScore["total"] += studentInterStd.score;

                    }
                }
            }
        }

        return {score: userCurrentScore, max: userCurrentMax };
    }

    isCategoryEnabled(name, categoryName)
    {
         var std = this.selectStandards(name);
         var category = std[categoryName];

         for (var i = 0; i < category.length; i++)
         {
             if (category[i].enabled === "yes") return true;
         }
         return false;
    }

    isSubcategoryEnabled(name, categoryName, num)
    {
        var std = this.selectStandards(name);
        var category = std[categoryName];

         for (var i = 0; i < category.length; i++)
         {
             if (category[i].enabled === "yes")
             {
                  if (category[i].number === num)
                  {
                    //  alert ("Show subcategory: " + category[i].subCategory);
                      return true;
                  }
             }


         }
         return false;
    }

    isLevelAllowToSeeThisSubcategory(name, categoryName, num, level)
    {
        var std = this.selectStandards(name);
        var category = std[categoryName];

         for (var i = 0; i < category.length; i++)
         {
             if (category[i].unlockedAtLevel <= level)
             {
                  if (category[i].number === num)
                  {
                      return true;
                  }
             }
         }
         return false;
    }

    getSubcategoryLevel(name, categoryName, num)
    {
        var std = this.selectStandards(name);


        var category = std[categoryName];

         for (var i = 0; i < category.length; i++)
         {
              if (category[i].number === num)
              {
                  return category[i].unlockedAtLevel;
              }

         }
         return -1;
    }

    getSubcategoryForProfileFix(name, categoryName, num)
    {
        var std = this.selectStandards(name);
        var category = std[categoryName];

         for (var i = 0; i < category.length; i++)
         {
             if (category[i].enabled === "yes")
             {
                  if (category[i].number === num)
                  {
                      return category[i].subCategory;
                  }
             }
         }
    }

    getSubcategoryLanguage(number, category) {
        var stdColl = this.standards[category];

        for (var i = 0; i < stdColl.length; i++)
        {
            if (stdColl[i].number == number)
            {
                return stdColl[i].name;
            }

        }







       /*
        for (var language in userSTD) {
            for (var cat in userSTD[language]) {
                var userSTDIntCategory = userSTD[language][cat];
                for (var i = 0; i < userSTDIntCategory.subcategories.length; i++)
                {
                     var subCat = userSTDIntCategory.subcategories[i];

                     if (subCat.number === number) {
                         return language;
                     }

                     else {
                         continue;
                     }
                }
            }
        }
        return "error";*/
    }
























}