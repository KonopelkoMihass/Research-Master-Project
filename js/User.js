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
        this.id = ""
    }


    update(data, messageType)
    {
      if (data !== "" && !Number.isInteger(data))
      {
          if (messageType === app.net.messageHandler.types.SIGN_IN_SUCCESSFUL ||
                messageType === app.net.messageHandler.types.SIGN_UP_SUCCESSFUL)
            {
                this.setData(data);

                app.assignments.getAllAssignment();
                app.standards.getStandards();

                if (data.role === "student")
                {
                    app.submissions.getPersonalSubmissions(data.id);
                }
                else
                {
                    app.submissions.getAllSubmissions();
                }

            }
      }

      this.notify(messageType);
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
         this.name =  data.name;
         this.surname =  data.surname;
         this.noun =  data.noun;
         this.role = data.role;
         this.id = data.id;
    }
}
