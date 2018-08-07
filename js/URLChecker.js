class URLChecker
{
    constructor()
    {
        this.ip = "";
        this.port = "";

        this.URLs = {};
    }

    setHost(ip, port)
    {
        this.ip = ip;
        this.port = port;

        if (this.host === "192.168.99.100")
		{
			this.port = 8001;
		}
    }


    updateURL(midPath, objID)
    {
        var path = window.location.pathname;
        var parts = path.split("/");

        if(parts.length > 2)
        {
            path = parts[0] + "/" + parts[1] + "/" + midPath;
            if(objID != "")
                path += "/" + objID;
        }
        window.history.pushState(window.location.pathname,
                                window.location.pathname, path);
    }















}