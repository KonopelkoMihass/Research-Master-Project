/**
 * Class responsible for handling messages received from the server.
 */
class MessageHandler {
	constructor() {
		/** @enum {string} */
		this.Types_ = {
		
			SIGN_IN: 'signin', 
			SIGN_IN_SUCCESSFUL: 'signin_successful', 
		};
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
			case app.net.messageHandler.Types_.SIGN_UP_SUCCESSFUL:
			app.viewManager.goToView(app.viewManager.VIEW.TITLE_SCREEN);
			break;
			case app.net.messageHandler.Types_.SIGN_IN_SUCCESSFUL:
			app.viewManager.goToView(app.viewManager.VIEW.TITLE_SCREEN);      
			break;
			
			default:
			console.log('No way to handle this message type: ' + type);
			
		}
	}	
}