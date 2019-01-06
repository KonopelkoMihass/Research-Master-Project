// Constructor for the MessageHandler class
constructor() {
	/** @enum {string} */
	this.Types_ = {
		GET_USER_DATA: 'get_user_data', 
		SEND_KEY: 'send_key', 
		SIGN_IN: 'signin', SIGN_IN_SUCCESSFUL: 'signin_successful', 
		SIGN_IN_FAILED: 'signin_failed', 
		SIGN_UP_SUCCESSFUL: 'signup_successful'};	
}
