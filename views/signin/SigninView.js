/**Responsible for displaying what the user sees**/
class SigninView extends View
{
	constructor(controller)
	{
		super();

		this.title = app.viewManager.VIEW.SIGNIN;
		this.controller = controller;
		this.setup();
	}

	/**Called whenever the model changes**/
	onNotify (model, messageType)
	{
		if(messageType === app.net.messageHandler.types.SIGN_IN_SUCCESSFUL)
		{
			var menuPanel = 0;

			if(model.role === "student")
			{
				menuPanel = document.getElementById("menupanel-student");
				document.getElementById("mps-assignments-button").click();
			}

			else if (model.role === "teacher")
			{
				menuPanel = document.getElementById("menupanel-teacher");
				document.getElementById("mpt-assignments-button").click();
			}


			menuPanel.style.display = "block";
			var viewNameBox = document.getElementsByClassName("view-name-box")[0];
			viewNameBox.style.display = "block";
		}

		else if(messageType === app.net.messageHandler.types.SIGN_IN_FAILED)
		{
			this.controller.showError("Details incorrect, please try again!");
		}
	}
}
