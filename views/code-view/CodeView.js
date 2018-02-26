/**Responsible for displaying what the user sees**/
class CodeView extends View
{
	constructor(controller)
	{
		super();

		this.title = app.viewManager.VIEW.CODE_VIEW;
		this.controller = controller;
		this.setup();
	}

	onNotify (model, messageType)
	{

	}


	setupView()
	{
		this.controller.prepareCodeHTMLs();
		var state = this.controller.model.codeViewState;

		if (state === "Clear")
		{
			this.controller.setViewAsClear();
		}

	}




	show()
	{

		this.setupView();

		super.show();
	}
}

