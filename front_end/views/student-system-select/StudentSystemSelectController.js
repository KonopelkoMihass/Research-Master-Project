/**Controller for sign in**/
class StudentSystemSelectController
{
	constructor(model)
	{
		this.model = model;
		this.setup();
	}

	forceToSelectPage()
	{
		var controller = this;
		app.viewManager.goToView(app.viewManager.VIEW.STUDENT_SYSTEM_SELECT);
		document.getElementById("menupanel-student").style.display = "none";
		document.getElementById("view-title").innerText = "Select the system you want to use?";

		document.getElementById("student-system-gamified").addEventListener("click", function () {
			controller.model.sendSystemSelectionResult("y");
			app.annalist.saveForLogs("selected_system", {"gamified":"y"});
			document.location.reload();
        });

		document.getElementById("student-system-nongamified").addEventListener("click", function () {
			controller.model.sendSystemSelectionResult("n");
			app.annalist.saveForLogs("selected_system", {"gamified":"n"});
			document.location.reload();
        });
	}


	setup()
	{

	}
}
