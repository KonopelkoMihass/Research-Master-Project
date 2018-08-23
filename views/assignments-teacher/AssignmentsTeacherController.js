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
		var controller = this;

		// Init Modal
		var modalBody = app.modalContentManager.getModalContent("add-assignment");
		var modalData = app.utils.createModal("add-assignment", "Add Assignment", modalBody, true);
		modalData.modal.style.display = "block";

		//Set minimum datetime and current datetime to now.
		var date = new Date()
		var today = new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString();
		today = today.substr(0, today.lastIndexOf("."));

		document.getElementById("assignment-submission-deadline").min = today;
		document.getElementById("assignment-submission-deadline").value = today;
		document.getElementById("assignment-review-deadline").min = today;
		document.getElementById("assignment-review-deadline").value = today;


		var submitBtn = modalData.submit;
		submitBtn.addEventListener("click", function ()
		{
			controller.createAssignment();
			var parentNode = modalData.modal.parentNode;
			parentNode.removeChild(modalData.modal);
        });

		// fill the select box
		var selectStandard = document.getElementById("add-assignment-standards");
		var standards = app.standards;

		for (var key in standards.standardsInfo)
		{
			var option = document.createElement("option");
			option.text = standards.standardsInfo[key]["name"];
			option.value = key;
			selectStandard.add(option);
		}


	}

	createAssignment()
	{
		var name = document.getElementById("assignment-name").value;

		var deadlineDate = document.getElementById("assignment-submission-deadline").value.split('T')[0];
		var deadlineTime = document.getElementById("assignment-submission-deadline").value.split('T')[1];

		var reviewTillDate = document.getElementById("assignment-review-deadline").value.split('T')[0];
		var reviewTillTime = document.getElementById("assignment-review-deadline").value.split('T')[1];


		var totalColons = deadlineTime.split(":").length-1;
		if (totalColons === 2)	{
			deadlineTime = deadlineTime.substring(0, deadlineTime.lastIndexOf(":"));
		}

		totalColons = reviewTillTime.split(":").length-1;
		if (totalColons === 2) {
			reviewTillTime = reviewTillTime.substring(0, reviewTillTime.lastIndexOf(":"));
		}


		var description = document.getElementById("assignment-description").value;
		var reviewersAmount = document.getElementById("assignment-total-reviewers").value;
		var selectStandard = document.getElementById("add-assignment-standards");

		var standardUsed = selectStandard.options[selectStandard.selectedIndex].value;
		var codingLanguageUsed = standardUsed.split('-')[0];

		this.model.createAssignment(name, deadlineTime, deadlineDate,reviewTillTime, reviewTillDate,  description,
			reviewersAmount, standardUsed, codingLanguageUsed);
	}

	deleteAssignment(id)
	{
		this.model.deleteAssignment(id);
	}

	update()
	{

	}
}
