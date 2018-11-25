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
		// Internal logic.
	}

	/**
	 * Handles the message received from the server based on the 
	 * message type.
	 * @param {Object} msg The message pack from server, containing 
	 *    'type' and 'data' parts.
	 */
	handleMessage(msg) {
		let msg = JSON.parse(msg);
		let type = msg.type;
		let data = msg.data;

		switch (type) {
			case app.net.messageHandler.Types.GET_USER_DATA:
				app.viewManager.goToView('signin');  
				break;
			case app.net.messageHandler.Types.SIGN_UP_SUCCESSFUL:
				app.viewManager.goToView(app.viewManager.View.TITLE_SCREEN);
				break;
			case app.net.messageHandler.Types.SIGN_IN_SUCCESSFUL:
				app.viewManager.goToView(app.viewManager.View.TITLE_SCREEN);  			      
				break;
			case app.net.messageHandler.Types.SIGNIN_FAILED:
				alert('You entered wrong credentials');	  
				break;			
		}
	}	
}