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
		this.controller.cleanUp();
		this.controller.prepareCodeHTMLs();
		this.controller.setupSideModal();


		var state = this.controller.model.codeViewState;

		if (state === "Clear")
		{
			this.controller.setupFileSelector(false);
			this.controller.setViewAsClear();
		}

		if (state === "Comments")
		{
			this.controller.retrieveAnyPreviousReviewData();
			this.controller.setupFileSelector(false);
			this.controller.allowReview(false);
			this.controller.setReviewData();
		}

		if (state === "Review")
		{
			this.controller.retrieveAnyPreviousReviewData();
			this.controller.setupFileSelector(true);
			this.controller.allowReview(true);
			this.controller.setReviewData();
		}

		this.controller.fileButtonPointer.click();
	}




	show()
	{

		this.setupView();

		super.show();
	}
}

