/**Responsible for displaying what the user sees**/
class FeedbackView extends View
{
	constructor(controller)
	{
		super();

		this.title = app.viewManager.VIEW.FEEDBACK;
		this.controller = controller;
		this.setup();
	}

	onNotify (model, messageType)
	{

	}


	show()
	{
		super.show();
	}
}
