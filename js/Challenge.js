class Challenge extends Model
{
    constructor()
    {
        super();
        this.code = "";
        this.issues = {};
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

    submitChallenge()
    {
        var data = {};
        data.code = this.code;
        data.issues = this.issues;

        app.net.sendMessage("create_challenge", data);
    }



    update(data, messageType)
    {
        if (data !== "" && !Number.isInteger(data))
        {
             if (messageType === app.net.messageHandler.types.TEACHER_CREATE_CHALLENGE_SUCCESSFUL ||
                 messageType === app.net.messageHandler.types.TEACHER_CREATE_CHALLENGE_FAILED)
            {
                console.log(messageType);

            }

        }

        this.notify(messageType);
    }




    /*setData(data)
    {
         this.email = data.email;
         this.name =  data.name;
         this.surname =  data.surname;
         this.noun =  data.noun;
         this.role = data.role;
         this.id = data.id;
    }*/
}
