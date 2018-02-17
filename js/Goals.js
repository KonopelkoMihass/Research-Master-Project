/**Model of Goals info which stores user's goals for this week in full detail**/
class Goals extends Model
{
    constructor()
    {
        super();
        this.goals = [];
        this.reviews = [];
        this.dayNumber = 0; // 1 to 7;
    }

    uploadGoal(title, description, wordCount, requirements, day, reviewers)
    {
        app.net.sendMessage("add_goal", this.getSerialisedGoal(title, description, wordCount, requirements, day, reviewers));
    }

    pullGoals()
    {
        // user data
        var data = {};
        data.email = app.user.email;
        app.net.sendMessage("pull_goals", data);
    }

    setGoals(data)
    {
        this.goals = data;
    }

    setWeekday(day){
        this.dayNumber = day;
    }

    /**Returns an object not JSON since sendMessage will convert to JSON**/
    getSerialisedGoal(title, requirements, wordCount, reviewFor, day, reviewers)
    {
        var goal_info = {};
        goal_info.title = title;
        goal_info.requirements = requirements;
        goal_info.word_count = wordCount;
        goal_info.review_for = reviewFor;
        goal_info.day = day;
        goal_info.reviewers = reviewers;

        // user data
        goal_info.email = app.user.email;

        return goal_info;
    }

    readySubmition(text, day, reviewers)
    {
         app.net.sendMessage("submit_goal", this.getSerialisedSubmission(text, day, reviewers));
    }

    getSerialisedSubmission(text, day, reviewers){
        var sub_info = {};
        sub_info.text = text;
        sub_info.day = day;
        sub_info.reviewers = reviewers;

        // user data
        sub_info.fullname = app.user.surname +" "+ app.user.name;
        sub_info.email = app.user.email;

        return sub_info;
    }

    pullPersonalReviews()
    {
        var data = {};
        data.student_email = app.user.email;
        app.net.sendMessage("pull_personal_reviews", data);
    }


    goToHomeview()
    {
        app.viewManager.goToView(app.viewManager.VIEW.PROFILE);
    }
}
