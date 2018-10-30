// File: message_handler.js
/* Line Length ruler.
----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|
         10        20        30        40        50        60        70        80        90        100
*/

/**
  Class responsible for handling messages received from the server.
**/
class MessageHandler {
	constructor() {	}

	 /**
   * Handles the message received from the server based on the 
	 * message type.
   * @param msg - the message pack from server, containing 
	 * "type" and "data" parts.
   */
	handleMessage(msg) {
		let msg = JSON.parse(msg);
		let type = msg.type;
		let data = msg.data;

		// some logic...
	}	
}