/**Model of User info sends information to the server and updates
*  the view depending on what is returned (e.g. signs in or error)**/
class User extends Model
{
    constructor()
    {
        super();
        this.email = "";
        this.githubUsername = "";
        this.githubEmail = "";
        this.name = "";
        this.surname = "";
        this.noun = "";
    }

    signup(email, githubUsername, githubEmail, name, surname, noun, password)
    {
        var userData = {};

        userData.email = email;
        userData.github_username = githubUsername;
        userData.github_email = githubEmail;
        userData.name = name;
        userData.surname = surname;
        userData.noun = noun;
        userData.password = password;

        app.net.sendMessage("signup", userData);
    }

    signin(email, password)
    {
        var userData = {};
        userData.email = email;
        userData.password = password;

        app.net.sendMessage("signin", userData);
    }

    setData(data)
    {
         this.email = data.email;
         this.githubUsername =  data.githubUsername;
         this.githubEmail =  data.githubEmail;
         this.name =  data.name;
         this.surname =  data.surname;
         this.noun =  data.noun;
    }
}
