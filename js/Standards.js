class Standards extends Model {
    constructor() {
        super();
        this.standards = {};
        this.standardsURLs = [];
    }


    pushStandards(file)
    {

        app.net.sendMessage("push_standard", {"html_content":file});
    }


    update(data, messageType)
    {
       if (data !== "" && !Number.isInteger(data))
        {
            if ( messageType === app.net.messageHandler.types.GET_STANDARD_SUCCESSFUL)
            {
                this.standards = {};
                this.standardsURLs[data["name"]] = data["url"];

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

}