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
			app.viewManager.goToView(app.viewManager.VIEW.HOMEPAGE);
		}

		else if(messageType === app.net.messageHandler.types.SIGN_UP_FAILED)
		{
			this.controller.showError("The email/profile name is already registered in the system or you have not filled everything");
		}
	}
}
