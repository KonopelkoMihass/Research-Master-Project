/**Model of User info sends information to the server and updates
*  the view depending on what is returned (e.g. signs in or error)**/
class User extends Model
{
    constructor()
    {
        super();
        this.email = "";
        this.name = "";
        this.surname = "";
        this.noun = "";
        this.role = "";
        this.id = "";
        this.log = "";
        this.gamified = "n";
        this.team = "";

        this.stdInternalisation = {};

        this.challengeModeOnly = true;
        this.gotInstructionEmails = {};
        this.stdInternalisationChanges = {};
        this.focus = {};
        this.teachers = {};
    }

    getSubcategoryScore(stdName, categoryName, num)
    {
        if (this.stdInternalisation.hasOwnProperty(stdName))
        {
            var std = this.stdInternalisation[stdName];

            for (var i = 0; i < std[categoryName].subcategories.length; i++)
            {
                if (std[categoryName].subcategories[i].number === num)
                {
                    return std[categoryName].subcategories[i].score;
                }
            }
        }

        return 0;
    }

    getSubcategoryLearnState(stdName, categoryName, num)
    {
        if (this.stdInternalisation.hasOwnProperty(stdName))
        {
            var std = this.stdInternalisation[stdName];

            for (var i = 0; i < std[categoryName].subcategories.length; i++)
            {
                if (std[categoryName].subcategories[i].number === num)
                {
                    return std[categoryName].subcategories[i].learnState;
                }
            }
        }

        return "ERROR";
    }




    calculateLevel(stdName)
    {
        if (this.stdInternalisation.hasOwnProperty(stdName))
        {
            var std = this.stdInternalisation[stdName];
            var level = 1;

            for (var key in std)
            {
                for (var i = 0; i < std[key].subcategories.length; i++)
                {
                    if (std[key].subcategories[i].score === 10)
                    {
                        level++;
                    }
                }
            }
            return level;
        }
        return "Complete first challenges to get a level."
    }


    update(data, messageType)
    {
        if (data !== "" && !Number.isInteger(data)) {
            if (messageType === app.net.messageHandler.types.SIGN_IN_SUCCESSFUL)
            {
                this.setData(data);
                app.standards.checkIfLearnStatesArePresent();
                app.assignments.getAllAssignment();
                app.standards.getStandards();

                if (data.role === "student")
                {
                    app.submissions.getPersonalSubmissions(data.id);
                }
                else app.submissions.getAllSubmissions();
            }
        }

        this.notify(messageType);
    }

    changePassword(email, oldPassword, newPassword)
    {
        var data = {};
        data.email = email;
        data.old_pass = oldPassword;
        data.new_pass = newPassword;

        app.net.sendMessage("change_password", data);
    }


    signup(email, teamName, name, surname, noun, password)
    {
        var userData = {};

        userData.email = email;
        userData.team_name = teamName;
        userData.name = name;
        userData.surname = surname;
        userData.noun = noun;
        userData.password = password;
        userData.role = "student";
        userData.std_internalisation = {};
        userData.got_instruction_emails = {};
        userData.std_internalisation_changes = {};
        userData.focus = {};
        userData.challenge_mode_only = "y";

        app.net.sendMessage("signup", userData);
    }

    signin(email, password)
    {
        var userData = {};
        userData.email = email;
        userData.password = password;

        app.net.sendMessage("signin", userData);
    }

    forgotPasswordRequest(email)
    {
        var userData = {};
        userData.email = email;
        app.net.sendMessage("forgot_password", userData);
    }


    signout()
    {
        document.location.reload();
    }

    reportSigninIssue(email, issue){
        var data = {};
        data.email = email;
        data.issue = issue;

        if (issue === "I forgot my password")
            this.forgotPasswordRequest(email);

        app.net.sendMessage("signin_issue", data);
    }


    setData(data) {
        this.email = data.email;
        this.name = data.name;
        this.surname = data.surname;
        this.noun = data.noun;
        this.role = data.role;
        this.id = data.id;
        this.gamified = data.gamification;
        this.stdInternalisation = data.std_internalisation;
        this.teamName = data.team_name;

        this.challengeModeOnly = data.challenge_mode_only === "y" ? true : false;
        this.gotInstructionEmails = data.got_instruction_emails;
        this.stdInternalisationChanges = data.std_internalisation_changes;
        this.focus = data.focus;
        this.teachers = data.teachers;

    }

    standardsReadyForExam(language)
    {
        return app.standards.standardsReadyForExam(language);
    }

    sendSystemSelectionResult(choice)
    {
        var userData = {};
        userData.email = this.email;
        userData.choice = choice;

        app.net.sendMessage("selected_system", userData);

    }

    saveFocusChange()
    {
        var userData = {};
        userData.email = this.email;
        userData.focus = this.focus;

        app.net.sendMessage("focus_change", userData);
    }

    isCategoryKnown(stdName, category, ignoreMastered)
    {
        if (this.stdInternalisation.hasOwnProperty(stdName))
        {
            var std = this.stdInternalisation[stdName];

            for (var i = 0; i < std[category].subcategories.length; i++)
            {
                if (std[category].subcategories[i].score > 0 &&
                    std[category].subcategories[i].score < 10 &&
                    ignoreMastered)
                {
                    return true;
                }

                else if (std[category].subcategories[i].score > 0 &&
                    !ignoreMastered)
                {
                    return true;
                }
            }
        }
        return false;
    }

    isSubcategoryKnown( stdNum, ignoreMasteres)
    {
        for (var name in this.stdInternalisation)
        {

            var std = this.stdInternalisation[name];
            for (var key in std)
            {
                for (var i = 0; i < std[key].subcategories.length; i++)
                {
                    if (std[key].subcategories[i].number === stdNum)
                    {
                        var currentLevel =  this.calculateLevel(name);
                        var isAvailable = app.standards.isLevelAllowToSeeThisSubcategory(name, key, stdNum, currentLevel);

                        if (ignoreMasteres && std[key].subcategories[i].score < 10 && isAvailable)
                            return true;
                        else if (!ignoreMasteres && std[key].subcategories[i].score >= 9 && isAvailable)
                            return true;
                    }
                }
            }
        }
        return false;
    }
}
