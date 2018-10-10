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
		if (messageType === "signin_successful")
		{
			this.controller.setupSTDProgressSelector();
		}
	}


	show()
	{




		super.show();
	}
}
