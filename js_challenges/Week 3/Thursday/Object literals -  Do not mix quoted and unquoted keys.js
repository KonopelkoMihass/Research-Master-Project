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
			'GET_USER_DATA': "get_user_data", 
			SEND_KEY: "send_key", 
			SIGN_IN: "signin", 
			SIGN_IN_SUCCESSFUL: "signin_successful", 
			SIGN_IN_FAILED: "signin_failed", 
			SIGN_UP_SUCCESSFUL: "signup_successful"
		};
	}

	// More code.
	
}