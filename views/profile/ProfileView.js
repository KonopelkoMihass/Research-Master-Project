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

	}


	show()
	{
		var menuPanel = document.getElementById("menupanel-student");
		menuPanel.style.display = "block";

		var viewNameBox = document.getElementsByClassName("view-name-box")[0];
		viewNameBox.style.display = "block";



		super.show();
	}
}
