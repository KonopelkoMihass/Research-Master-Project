/**Responsible for displaying what the user sees**/
class SignupView extends View
{
	constructor(controller)
	{
		super();
		this.title = app.viewManager.VIEW.SIGNUP;
		this.controller = controller;
		this.setup();
	}


	/**Called whenever the model changes**/
	onNotify (model, messageType)
	{
		if(messageType === app.net.messageHandler.types.SIGN_UP_SUCCESSFUL)
		{
			document.getElementById("mps-assignments-button").click();
			var menuPanel = document.getElementById("menupanel-student");
			menuPanel.style.display = "block";

			var viewNameBox = document.getElementsByClassName("view-name-box")[0];
			viewNameBox.style.display = "block";

		}

		else if(messageType === app.net.messageHandler.types.SIGN_UP_FAILED)
		{
			this.controller.showError("The email/profile name is already registered in the system or you have not filled everything");
		}
	}
}
