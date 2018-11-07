///**class Net**/
class Net
{
	constructor()
	{
		this.host = "";
		this.port = "";
		this.messageHandler = new MessageHandler();
	}

	setHost (ip, port)
	{
		this.host = ip;
		this.port = port;

		if (this.host === "192.168.99.100")
		{
			this.port = 8001;
		}
	}

	connect ()
	{
		var that = this;

		this.ws = new WebSocket("ws://"+this.host+":"+this.port+"/CRServer");

		this.ws.onopen = function()
		{

		};

		this.ws.onmessage = function (evt)
		{
		   	that.messageHandler.handleMessage(evt.data);
		};

		this.ws.onclose = function()
		{
			console.log("ws closed");
		};
	}

	sendMessage (type, data)
	{
		var msg = {};
		msg.data = data;
		msg.type = type;

		var m = JSON.stringify(msg);
		m = JSON.parse(m);
		this.ws.send(JSON.stringify(msg));
	}

	/**this method is mostly used to talk with the server.**/
	XHR (type, url, callback, params)
	{
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function()
		{
		    if (xhr.readyState === 4)
			{
		    	callback(xhr.responseText);
		    }
		};
		xhr.open(type, url, true);
		if(params === undefined){
			params = null;
		}
		xhr.send(params);
	};
}
