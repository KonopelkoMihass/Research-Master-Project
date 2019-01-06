class MessageHandler {
	constructor() {
		// Inner Logic.
	}

	/**
	 * Handles the message received from the server based on the 
	 * message type.
	 * @param {Object} msg The message pack from server, containing 
	 *    'type' and 'data' parts.
	 */
	handleMessage(msg) {
		let Message = JSON.parse(msg);
		let type = Message.type;
		let data = Message.data;

		// More code.
	}	
}