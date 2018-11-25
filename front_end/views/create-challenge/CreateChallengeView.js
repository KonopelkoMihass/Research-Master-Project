/**Responsible for displaying what the user sees**/
class CreateChallengeView extends View
{
	constructor(controller)
	{
		super();

		this.title = app.viewManager.VIEW.CREATE_CHALLENGE;
		this.controller = controller;
		this.setup();
	}

	onNotify (model, messageType)
	{

	}


	setupView()
	{
		this.controller.createSubmitChallengeFileModal();
	}




	show()
	{
		this.setupView();
		super.show();
	}
}

