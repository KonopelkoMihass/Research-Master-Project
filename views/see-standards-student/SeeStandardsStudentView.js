/**Responsible for displaying what the user sees**/
class SeeStandardsStudentView extends View
{
	constructor(controller)
	{
		super();

		this.title = app.viewManager.VIEW.SEE_STANDARDS_STUDENT;
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
