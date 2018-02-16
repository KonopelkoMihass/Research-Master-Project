/**Responsible for displaying what the user sees**/
class HomepageView extends View
{
	constructor(controller)
	{
		super();

		this.title = app.viewManager.VIEW.HOMEPAGE;
		this.controller = controller;
		this.setup();
	}

	show()
	{
		var menuPanel = document.getElementById("menupanel");
		menuPanel.style.display = "block";
		super.show();
	}
}
