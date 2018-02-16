/**Responsible for displaying what the user sees**/
class SigninView extends View
{
	constructor(controller)
	{
		super();

		this.title = app.viewManager.VIEW.SIGNIN;
		this.controller = controller;
		this.setup();
	}

	/**Called whenever the model changes**/
	onNotify (model, messageType)
	{
		if(messageType === app.net.messageHandler.types.SIGN_IN_SUCCESSFUL)
		{
			app.viewManager.goToView(app.viewManager.VIEW.HOMEPAGE);

			//var modalData = app.uiFactory.createModal("Brebere", "Hallo");
			//document.body.appendChild(modalData.modal);
			//modalData.modal.style.display = "block";
		}

		else if(messageType === app.net.messageHandler.types.SIGN_IN_FAILED)
		{
			this.controller.showError("Details incorrect, please try again!");
		}
	}
}
