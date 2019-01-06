// Part of the Message Handler class.
handleMessage(msg) {
	let messageObj = new Object();
	messageObj = JSON.parse(msg);
	let type = messageObj.type;
	let data = messageObj.data;

	// More stuff.
}	
