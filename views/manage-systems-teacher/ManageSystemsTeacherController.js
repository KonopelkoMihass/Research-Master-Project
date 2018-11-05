class ManageSystemsTeacherController
{
	constructor(model)
	{
		this.model = model;
		this.setup();
	}

	setup()
	{
		var controller = this;
		document.getElementById("manage-systems-teacher-switcher").addEventListener("click", function () {
			controller.model.invertSystems();
        });

		document.getElementById("manage-systems-teacher-choice").addEventListener("click", function () {
			controller.model.enableSystemSwitch();
        });

		var challengeOnlySwitchButton = document.getElementById("manage-systems-teacher-challenge-mode-only");
		var challengeOnly = app.user.challengeModeOnly;

		challengeOnlySwitchButton.innerText = challengeOnly  ? "Switch off" : "Switch on";


		challengeOnlySwitchButton.addEventListener("click", function ()
        {
            app.user.challengeModeOnly = !app.user.challengeModeOnly;
            this.innerText = app.user.challengeModeOnly  ? "Switch off" : "Switch on";
			app.net.sendMessage("challenge_mode_switch",  app.user.challengeModeOnly);
        });


	}


	update()
	{

	}
}
