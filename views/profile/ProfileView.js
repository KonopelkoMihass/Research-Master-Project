/**Responsible for displaying what the user sees**/
class ProfileView extends View
{
	constructor(controller)
	{
		super();

		this.title = app.viewManager.VIEW.PROFILE;
		this.controller = controller;
		this.setup();
	}

	onNotify (model, messageType)
	{
		if (messageType === app.net.messageHandler.types.GET_STANDARD_SUCCESSFUL ||
			messageType === app.net.messageHandler.types.UPLOAD_CHALLENGE_RESULTS_SUCCESSFUL)
		{
			this.controller.setupSTDProgressSelector();
		}
	}


	show()
	{




		super.show();
	}
}
