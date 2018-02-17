/**Responsible for displaying what the user sees**/
class AssignmentsTeacherView extends View
{
	constructor(controller)
	{
		super();

		this.title = app.viewManager.VIEW.ASSIGNMENTS_TEACHER;
		this.controller = controller;
		this.setup();
	}

	show()
	{
		var menuPanel = document.getElementById("menupanel-teacher");
		menuPanel.style.display = "block";
		super.show();
	}
}
