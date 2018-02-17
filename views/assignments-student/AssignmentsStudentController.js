class AssignmentsStudentController
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
	}


	createSubmitAssignmentModal(id)
	{
		var controller = this;

		var modalBody = app.modalContentManager.getModalContent("submit-assignment");
		var modalData = app.uiFactory.createModal("add-assignment", "Submit Assignment", modalBody);
		document.body.appendChild(modalData.modal);
		modalData.modal.style.display = "block";

		// Find assignment
		var assignment = undefined;
		for (var i = 0; i < this.model.assignments.length; i++)
		{
			if( this.model.assignments[i].id === id)
			{
				assignment = this.model.assignments[i] ;
			}

		}

		document.getElementById("assignment-description").innerText = "Description: " + assignment.description;
		document.getElementById("assignment-deadline").innerHTML = "Deadline: " + assignment.deadlineDate + " " + assignment.deadlineTime;

	}














	/*createAddAssignmentModal()
	{
		var controller = this;

		// Init Modal
		var modalBody = app.modalContentManager.getModalContent("add-assignment");
		var modalData = app.uiFactory.createModal("add-assignment", "Add Assignment", modalBody);
		document.body.appendChild(modalData.modal);
		modalData.modal.style.display = "block";

		//Set minimum datetime and current datetime to now.
		var today = new Date().toISOString();
		today = today.substr(0, today.lastIndexOf("."));
		document.getElementById("assignment-deadline").min = today;
		document.getElementById("assignment-deadline").value = today;

		var submitBtn = modalData.submit;
		submitBtn.addEventListener("click", function () {
			controller.createAssignment();
			var parentNode = modalData.modal.parentNode;
			parentNode.removeChild(modalData.modal);
        });


	}

	createAssignment()
	{
		var name = document.getElementById("assignment-name").value;
		var description = document.getElementById("assignment-description").value;
		var deadlineDate = document.getElementById("assignment-deadline").value.split('T')[0];
		var deadlineTime = document.getElementById("assignment-deadline").value.split('T')[1];
		this.model.createAssignment(name, deadlineTime, deadlineDate, description);
	}

	deleteAssignment(id)
	{
		this.model.deleteAssignment(id);
	}*/











	update()
	{

	}
}
