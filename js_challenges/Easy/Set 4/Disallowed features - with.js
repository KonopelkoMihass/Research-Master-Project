// Method in Message Handler class.
handleMessage(msg) {
	let msg = JSON.parse(msg);
	let type = msg.type;
	let data = msg.data;

	with (app.net.messageHandler.Types_){
		if (type === GET_USER_DATA) {
			app.viewManager.goToView('signin');   
		}	else if (type === SIGN_UP_SUCCESSFUL) {
			app.viewManager.goToView(app.viewManager.VIEW.TITLE_SCREEN);   
		}	else if (type === SIGN_IN_SUCCESSFUL) {
			app.viewManager.goToView(app.viewManager.VIEW.TITLE_SCREEN);  			      
		} else if (type === SIGNIN_FAILED) {
			alert('You entered wrong credentials');	  
		}
	}	
}
