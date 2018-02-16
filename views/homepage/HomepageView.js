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

	/**Updates the view to reflect the latest model**/
	display (model)
	{
	}

	/**Called whenever the model changes**/
	onNotify (model)
	{
		this.display(model);
	}

	show()
	{
		//console.log("Trigger get data");
		//app.net.sendMessage("get_user_data","");
		super.show();
	}
}
