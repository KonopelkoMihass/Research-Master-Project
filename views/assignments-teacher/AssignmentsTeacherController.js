class AssignmentsTeacherController
{
	constructor(model)
	{
		this.model = model;
		this.setup();
	}

	setup()
	{
		var controller = this;
		console.log(this.model);

		var addBtn = document.getElementById("add-assignment-button");
		addBtn.addEventListener("click", function()
		{
			controller.createAddAssignmentModal();
		});
	}


	createAddAssignmentModal()
	{
		var modalBody = app.modalContentManager.getModalContent("add-assignment");
		var modalData = app.uiFactory.createModal("add-assignment", "Add Assignment", modalBody);


		document.body.appendChild(modalData.modal);
		modalData.modal.style.display = "block";
	}













	update()
	{

	}
}
