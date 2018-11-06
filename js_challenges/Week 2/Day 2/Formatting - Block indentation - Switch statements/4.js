// File: message_handler.js
/* Line Length ruler.
----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|
         10        20        30        40        50        60        70        80        90        100
*/

/**
 * Class responsible for handling messages received from the server.
 */
class MessageHandler {
	constructor() {
		/** @private @const {!Object<string, string} */
		this.TYPES_ = {
			SIGN_IN_SUCCESSFUL: "signin_successful", 
		};
	}

	/**
	 * Handles the message received from the server based on the 
	 * message type.
	 * @param {Object} msg The message pack from server, containing 
	 *    "type" and "data" parts.
	 */
	handleMessage(msg) {
		let msg = JSON.parse(msg);
		let type = msg.type;
		let data = msg.data;

		switch (type) {
		case app.net.messageHandler.TYPES.SIGN_IN_SUCCESSFUL: 
			app.viewManager.goToView(app.viewManager.VIEW.TITLE_SCREEN);  			      
			break;
		case app.net.messageHandler.TYPES.SIGNIN_FAILED:
			alert("You entered wrong credentials");	  
			break;
		}
	}	
}