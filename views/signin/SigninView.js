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
			if(model.role === "student")
			{
				document.getElementById("mps-profile-button").click();
			}

			else if (model.role === "teacher")
			{
				document.getElementById("mpt-assignments-button").click();
			}
		}

		else if(messageType === app.net.messageHandler.types.SIGN_IN_FAILED)
		{
			this.controller.showError("Details incorrect, please try again!");
		}
	}
}
