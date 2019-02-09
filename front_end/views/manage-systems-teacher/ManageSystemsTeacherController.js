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
		    var groupSelected = "";

            var radios = document.getElementsByName('manage_system-group');
            for (var i = 0, length = radios.length; i < length; i++) {
                if (radios[i].checked) {
                   groupSelected = radios[i].value;
                    break;
                }
            }

            if (groupSelected === "") alert("Select a group");
            else controller.model.invertSystems(groupSelected);
        });

		document.getElementById("manage-systems-teacher-choice").addEventListener("click", function () {
		    var groupSelected = "";

            var radios = document.getElementsByName('manage_system-group');
            for (var i = 0, length = radios.length; i < length; i++) {
                if (radios[i].checked) {
                   groupSelected = radios[i].value;
                    break;
                }
            }

            if (groupSelected === "") alert("Select a group");
			else controller.model.enableSystemSwitch(groupSelected);
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
