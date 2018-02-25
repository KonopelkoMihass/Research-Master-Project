/**Responsible for displaying what the user sees**/
class SeeSubmissionsStudentView extends View
{
	constructor(controller)
	{
		super();

		this.title = app.viewManager.VIEW.SEE_SUBMISSIONS_STUDENT;
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
