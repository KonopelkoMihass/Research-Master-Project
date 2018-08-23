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
                //this.standards = {};
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
}