/**Responsible for displaying what the user sees**/
class SeeSubmissionsTeacherView extends View
{
	constructor(controller)
	{
		super();

		this.title = app.viewManager.VIEW.SEE_SUBMISSIONS_TEACHER;
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
