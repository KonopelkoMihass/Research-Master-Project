/**Responsible for displaying what the user sees**/
class PerformReviewStudentView extends View
{
	constructor(controller)
	{
		super();

		this.title = app.viewManager.VIEW.PERFORM_REVIEW_STUDENT;
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
