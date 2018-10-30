// File: message_handler.js
/* Line Length ruler.
----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|
         10        20        30        40        50        60        70        80        90        100
*/

/**
  Class responsible for handling messages received from the server.
**/
class MessageHandler {
	constructor() {
		/** @private @const {!Types} */
		this.types_ = {
			GET_USER_DATA: "get_user_data", 
			SEND_KEY: "send_key", 
			SIGN_IN:"signin", 
			SIGN_IN_SUCCESSFUL:"signin_successful", 
			SIGN_IN_FAILED:"signin_failed", 
			SIGN_UP_SUCCESSFUL:"signup_successful"
		};
	}

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

		if (type === app.net.messageHandler.types_.GET_USER_DATA) {
			app.viewManager.goToView("signin");   
		} if (type === app.net.messageHandler.types_.SIGN_UP_SUCCESSFUL) {
			app.viewManager.goToView(app.viewManager.VIEW.TITLE_SCREEN);   
		} if (type === app.net.messageHandler.types_.SIGN_IN_SUCCESSFUL) {
			app.viewManager.goToView(app.viewManager.VIEW.TITLE_SCREEN);  			      
		} if (type === app.net.messageHandler.types_.SIGNIN_FAILED) {
			alert("You entered wrong credentials");	  
		}
	}	
}