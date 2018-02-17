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
				app.viewManager.goToView(app.viewManager.VIEW.PROFILE);
			}

			else if (model.role === "teacher")
			{
				app.viewManager.goToView(app.viewManager.VIEW.ASSIGNMENTS_TEACHER);
			}
		}

		else if(messageType === app.net.messageHandler.types.SIGN_IN_FAILED)
		{
			this.controller.showError("Details incorrect, please try again!");
		}
	}
}
