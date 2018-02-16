/**Handles messages**/
class MessageHandler
{
	constructor  ()
	{
		this.types = {
			SIGN_IN_SUCCESSFUL: "signin_successful",
			SIGN_IN_FAILED: "signin_failed",

			SIGN_UP_SUCCESSFUL: "signup_successful",
			SIGN_UP_FAILED: "signup_failed"
		};
	}

	handleMessage (message)
	{
		var msg = JSON.parse(message);
		var type = msg.type;
		var data = msg.data;

		console.log("Message received:", type,"-", data);

		if(type === app.net.messageHandler.types.SIGN_UP_SUCCESSFUL)
		{
			//Sign in on successful signup.
			app.user.signin(data.email,data.password);
		}
		else if(type === app.net.messageHandler.types.SIGN_IN_SUCCESSFUL)
		{
			app.user.setData(data);
			app.viewManager.goToView(app.viewManager.VIEW.HOMEPAGE);
			
			//var modalData = app.uiFactory.createModal("Brebere", "Hallo");
			//document.body.appendChild(modalData.modal);
			//odalData.modal.style.display = "block";
		}


		else if(type === app.net.messageHandler.types.SIGN_IN_FAILED)
		{
			app.signinController.showError("Details incorrect, please try again!");
		}
		else if(type === app.net.messageHandler.types.SIGN_UP_FAILED)
		{
			app.signupController.showError("The email/profile name is already registered in the system or you have not filled everything");
		}
	}
}
