handleMessage(msg) {
	let msg = JSON.parse(msg);
	let type = msg.type, data = msg.data;

	if (type === app.net.messageHandler.Types_.GET_USER_DATA) {
		app.viewManager.goToView('signin');   
	}	else if (type === app.net.messageHandler.Types_.SIGN_UP_SUCCESSFUL) {
		app.viewManager.goToView(app.viewManager.VIEW.TITLE_SCREEN);   
	}	else if (type === app.net.messageHandler.Types_.SIGN_IN_SUCCESSFUL) {
		app.viewManager.goToView(app.viewManager.VIEW.TITLE_SCREEN);  			      
	} else if (type === app.net.messageHandler.Types_.SIGNIN_FAILED) {
		alert('You entered wrong credentials');	  
	}
}	
