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
		var controller = this;

		var signinButton = document.getElementById("signin-button");
		signinButton.addEventListener("click", function(){controller.signin()} );

		var signupButton = document.getElementById("signup-link");
		signupButton.addEventListener("click", function(){app.viewManager.goToView("signup");} );

		var signinTrouble = document.getElementById("signin-trouble-link");
		signinTrouble.addEventListener("click", function(){

            var modalBody = app.modalContentManager.getModalContent("report-signin-error");
            var modalData = app.utils.createModal("report-signin-error", "Report Signin Issue.", modalBody, true);

            document.body.appendChild(modalData.modal);
            modalData.modal.style.display = "block";


            var submitBtn = modalData.submit;

            submitBtn.addEventListener("click", function ()
            {
                var email = document.getElementById("sign-in-issue-email").value;

                if (email !== "" && email.indexOf("@itcarlow.ie") !== -1)
                {
                    var issues = document.getElementsByName("sign-in-issue");
                    var selectedIssue = false;
                    for (var i = 0; i < issues.length; i++){
                        if (issues[i].checked)
                        {
                            controller.model.reportSigninIssue(email, issues[i].value);
                            selectedIssue = true;
                            var parentNode = modalData.modal.parentNode;
				            parentNode.removeChild(modalData.modal);
                        }
                    }
                    if (!selectedIssue) alert ("Select an issue you have");

                } else {
                    alert ("Please enter a correct email.");
                }
            });
            var closes = modalData.closes;
            for (var i = 0; i < closes.length; i++) {
                closes[i].addEventListener("click", function ()
                {
                    var oldEl = document.getElementById("report-signin-error-submit");
                    var newEl = oldEl.cloneNode(true);
                    oldEl.parentNode.replaceChild(newEl, oldEl);
                });
            }
		});


	}

	onKeyPress(key){
	    if (key === "Enter") {
	        document.getElementById("signin-button").click();
        }
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
