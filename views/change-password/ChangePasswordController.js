/**Controller for sign in**/
class ChangePasswordController
{
	constructor(model)
	{
		this.model = model;
		this.setup();
	}

	setup()
	{
		var that = this;

		var submitButton = document.getElementById("change-password-button");
		submitButton.addEventListener("click", function()
        {
           	var email = document.getElementById("change-password-email").value;
    	    var oldPassword = document.getElementById("change-password-old-password").value;

            var newPassword = document.getElementById("change-password-new-password").value;
            var repeatPassword = document.getElementById("change-password-repeat-new-password").value;

            if (oldPassword === newPassword)
            {
                that.showError("Please select a new password");
            }

            else if (newPassword === repeatPassword)
            {
                if (newPassword.length < 8 )
                {
                     that.showError("Please select a longer password");
                }

                else
                {
                    that.model.changePassword(email, oldPassword, newPassword);
                }
            }

            else
            {
                that.showError("New passwords do not much");
            }





        } );
	}


	showError(errMessage)
	{
		document.getElementById("change-password-error").innerHTML = errMessage;
	}

}
