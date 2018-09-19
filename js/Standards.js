class Standards extends Model {
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
                        this.standards[stdFromServer[i]["category"]].push(new Standard(stdFromServer[i], i+1));
                    }

                    else
                    {
                        this.standards[stdFromServer[i]["category"]] = [];
                        this.standards[stdFromServer[i]["category"]].push(new Standard(stdFromServer[i], i+1));
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

    updateInternalisationSkillTree(scores, language)
    {
        var userSTD = app.user.stdInternalisation;

        if (Object.keys(userSTD).length === 0)
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

                var userSubcat = "";

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

                userSubcat.score += (score - overflow);
                userSTDIntCategory.score += (score - overflow);
            }
        }

        // send it
        var data = {};
        data.email = app.user.email;
        data.std_internalisation = userSTD;

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

                    stdSkills[cat].subcategories.push(subcatSkill);
                    stdSkills[cat].maxScore += 10;
                }
            }
        }
        return stdSkills;
    }

    getCategoryScoreData(language, category)
    {
        var d = {};
        d.score = app.user.stdInternalisation[language][category].score;
        d.maxScore = app.user.stdInternalisation[language][category].maxScore;

        return d;
    }


    getSTDSubcategorySkill(language, category, subcategory)
    {
         var userSTD = app.user.stdInternalisation[language];
         var cat = userSTD[category];

         for (var i = 0; i < cat.subcategories.length; i++)
         {
             if (cat.subcategories[i].name === subcategory)
             {
                return cat.subcategories[i];
             }
         }
    }
}