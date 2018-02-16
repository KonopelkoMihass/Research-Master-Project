/**Controller for sign in**/
class SigninController
{
	constructor(model)
	{
		this.model = model;
		this.setup();
	}

	setup()
	{
		var that = this;

		var signinButton = document.getElementById("signin-button");
		signinButton.addEventListener("click", function(){that.signin()} );

		var signupButton = document.getElementById("signup-link");
		signupButton.addEventListener("click", function(){app.viewManager.goToView("signup");} );
	}

	signin(e)
	{
		var email = document.getElementById("signin-email").value;
    	var password = document.getElementById("signin-password").value;
    	this.model.signin(email,password);
	}

	showError(errMessage)
	{
		document.getElementById("signin-error").innerHTML = errMessage;
	}
}
