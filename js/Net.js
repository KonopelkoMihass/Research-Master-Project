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
	}

	connect ()
	{
		var that = this;
		this.ws = new WebSocket("ws://"+this.host+":"+this.port+"/GCodeReviewer");

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
		console.log(m);
		m = JSON.parse(m);
		console.log(m);
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
