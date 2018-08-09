class Tracker
{
    constructor(net)
    {
        this.net = net;
        this.logs = [];
        this.userID = "";

        var logEntry = {};
        logEntry.side = "client";
        logEntry.type = "entered the site";
        logEntry.datetime = new Date();
        this.logs.push(logEntry);
    }

    updateTracks()
    {
        var docBodyChildren = document.getElementsByTagName("body")[0].children;
        this.recursiveCheck(docBodyChildren);
    }

    setupWithinModal(body)
    {
        var docBodyChildren = body.children;
        this.recursiveCheck(docBodyChildren);
    }


    setUserID (id)
    {
        this.userID = id;
    }

    recursiveCheck(docBodyIn)
    {
        var tracker = this;
        //for every element in the body
        for (var i = 0; i < docBodyIn.length; i++)
        {
            if(docBodyIn[i].children.length > 0)
            {
                this.recursiveCheck(docBodyIn[i].children);
            }

            else
            {
                try
                {
                    if(docBodyIn[i].id !== "")
                    {
                        //console.log("TRACK -> ", docBodyIn[i].id);
                        app.uiFactory.assignFuncToButtonViaID(docBodyIn[i].id, function(){tracker.track(this)} );
                    }
                }
                catch (e) {}
            }
        }
    }

    track(element)
    {
        var logEntry = {};
        logEntry.side = "client";
        logEntry.type = "element pressed";
        logEntry.elementID = element.id;
        logEntry.elementTagName = element.tagName;
        logEntry.elementNodeType  = element.nodeName;
        logEntry.datetime = new Date();
        this.logs.push(logEntry);
    }

    trackServerMessages(data, messageType)
    {
        if (data !== "" && !Number.isInteger(data))
        {
            if (messageType === app.net.messageHandler.types.SIGN_IN_SUCCESSFUL ||
                messageType === app.net.messageHandler.types.SIGN_UP_SUCCESSFUL) {
                //Get user ID - without it we cannot allocate track logs to someone.
                this.userID = data.id;
            }
            var mesTypes = app.net.messageHandler.types;
            var logThis = !(messageType === mesTypes.SAVE_LOGS_FAILED ||
                            messageType === mesTypes.SAVE_LOGS_SUCCESSFUL);

            if (logThis)
            {
                var logEntry = {};
                logEntry.side = "server";
                logEntry.type = "message";
                logEntry.messageType = messageType;
                logEntry.datetime = new Date();
                logEntry.messageData = {};


                var saveData = !(messageType === mesTypes.GET_STANDARD_SUCCESSFUL);

                if (saveData)
                {
                    logEntry.messageData = data;
                }

                this.logs.push(logEntry);
            }
        }
    }

    trackViewChanges(oldView, newView)
    {
        var tracker = this;
        var logEntry = {};
        logEntry.side = "client";
        logEntry.type = "view change";
        logEntry.datetime = new Date();
        logEntry.from = oldView;
        logEntry.to = newView;

        // minor delay to keep the log order.
        setTimeout(function(){tracker.logs.push(logEntry) }, 200);
    }

    trackModalCreation(title)
    {
        var logEntry = {};
        logEntry.side = "client";
        logEntry.type = "modal created";
        logEntry.datetime = new Date();
        logEntry.modalName = title;
        this.logs.push(logEntry);
    }

    trackModalDestruction(title)
    {
        var logEntry = {};
        logEntry.side = "client";
        logEntry.type = "modal destroyed";
        logEntry.datetime = new Date();
        logEntry.modalName = title;
        this.logs.push(logEntry);
    }

    sendAndClearLogs(isPageUnload)
    {
        if (this.userID !== "")
        {
            if (isPageUnload)
            {
                var logEntry = {};
                logEntry.side = "client";
                logEntry.type = "leaving the site";
                logEntry.datetime = new Date();
                this.logs.push(logEntry);
            }

            app.net.sendMessage("save_logs", {"user_id":this.userID, "logs": this.logs});
            console.log("logs", this.logs);
            this.logs = [];
        }
    }
}