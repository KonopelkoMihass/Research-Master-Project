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
		if (messageType === "get_challenge_successful")
		{
			this.controller.cleanUp();
			this.controller.prepareCodeHTMLs();
			this.controller.setReviewData();
			this.controller.setupSideModal();
			this.controller.startTimer();
			this.controller.updateIssueCountLabel();
		}
	}


	setupView()
	{
		this.controller.allowReview();

		if (app.user.gamified === "y") this.controller.alterView();

	}


	show()
	{
		this.setupView();
		super.show();
	}
}
