class Standards extends Model {
    constructor() {
        super();
        this.standards = {};
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
                for (var i = 0; i < data.length; i++)
                {
                    if (data[i]["category"] in this.standards)
                    {
                        this.standards[data[i]["category"]].push(new Standard(data[i]));
                    }

                    else
                    {
                        this.standards[data[i]["category"]] = [];
                        this.standards[data[i]["category"]].push(new Standard(data[i]));
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