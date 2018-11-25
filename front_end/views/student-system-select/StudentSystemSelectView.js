/**Responsible for displaying what the user sees**/
class StudentSystemSelectView extends View
{
	constructor(controller)
	{
		super();
		this.title = app.viewManager.VIEW.STUDENT_SYSTEM_SELECT;
		this.controller = controller;
		this.setup();
	}

	/**Called whenever the model changes**/
	onNotify (model, messageType)
	{
		if(messageType === app.net.messageHandler.types.SIGN_IN_SUCCESSFUL)
		{
			if (this.controller.model.gamified === "r")
			{
				this.controller.forceToSelectPage();
			}
        }
	}
}
