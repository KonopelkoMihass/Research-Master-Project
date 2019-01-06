// methods from some class

constructor() {}

parseMessages() { }

/**
 * Handles the message received from the server based on the 
 * message type.
 * @param {Object} msg The message pack from server, containing 
 *    "type" and "data" parts.
 */
handleMessage(msg) {
	let msg = this.parseMessages(msg);
	let type = msg.type;
	let data = msg.data;

	// some logic...
}