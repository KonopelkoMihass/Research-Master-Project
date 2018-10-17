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
	}


	update()
	{

	}
}
