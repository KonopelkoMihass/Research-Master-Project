/**Responsible for displaying what the user sees**/
class ChallengeView extends View
{
	constructor(controller)
	{
		super();

		this.title = app.viewManager.VIEW.CHALLENGE;
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
		this.controller.allowReview();
		this.controller.setReviewData();

		this.controller.startTimer();
	}




	show()
	{
		this.setupView();
		super.show();
	}
}
