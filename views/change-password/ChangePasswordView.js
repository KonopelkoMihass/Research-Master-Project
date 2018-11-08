/**Responsible for displaying what the user sees**/
class ChangePasswordView extends View
{
	constructor(controller)
	{
		super();

		this.title = app.viewManager.VIEW.CHANGE_PASSWORD;
		this.controller = controller;
		this.setup();
	}

	/**Called whenever the model changes**/
	onNotify (model, messageType)
	{
		if(messageType === app.net.messageHandler.types.CHANGE_PASSWORD_SUCCESSFUL)
		{
			alert("Your password successfully changed");
			app.viewManager.goToView(app.viewManager.VIEW.SEE_STANDARDS_STUDENT)
		}

		else if(messageType === app.net.messageHandler.types.CHANGE_PASSWORD_FAILED)
		{
			this.controller.showError("Your old password is incorrect...");
		}
	}
}
