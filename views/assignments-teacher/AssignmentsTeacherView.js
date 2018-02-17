/**Responsible for displaying what the user sees**/
class AssignmentsTeacherView extends View
{
	constructor(controller)
	{
		super();

		this.title = app.viewManager.VIEW.ASSIGNMENTS_TEACHER;
		this.controller = controller;
		this.setup();
	}


	onNotify (model, messageType)
	{
		var that = this;

		// Update the table of assessments
		if (messageType === app.net.messageHandler.types.TEACHER_ASSIGNMENTS_CREATION_SUCCESSFUL ||
			messageType === app.net.messageHandler.types.GET_ASSIGNMENTS_SUCCESSFUL ||
			messageType === app.net.messageHandler.types.ASSIGNMENT_DELETE_SUCCESSFUL )
		{
			var assignmentTable = document.getElementById("assignments-table");

			// remove all data in there.
			var rowCount = assignmentTable.rows.length;
			while(--rowCount)
			{
				assignmentTable.deleteRow(rowCount);
			}

			var assignments = model.assignments;

			for (var i = 0; i < assignments.length; i++)
			{
				var row = assignmentTable.insertRow(i + 1);


				var cell0 = row.insertCell(0);
				var cell1 = row.insertCell(1);
				var cell2 = row.insertCell(2);
				var cell3 = row.insertCell(3);
				var cell4 = row.insertCell(4);

				var img = document.createElement("IMG");
				img.src = "resources/images/trash-button.png";
				img.id = assignments[i].id + "-delete-assignment-button";
				img.className = "trash-button";
				img.addEventListener("click", function()
				{
					var id = parseInt(this.id.split('-')[0]);
					that.controller.deleteAssignment(id);
				});
				cell0.appendChild(img);


				cell1.innerHTML = assignments[i].name;
				cell2.innerHTML = assignments[i].description;
				cell3.innerHTML = assignments[i].deadlineDate;
				cell4.innerHTML = assignments[i].deadlineTime;
			}

			// Add one more, where you can add a new assignment
			var emptyRow = assignmentTable.insertRow(assignments.length + 1);
			var iconCell = emptyRow.insertCell(0);
			emptyRow.insertCell(1);
			emptyRow.insertCell(2);
			emptyRow.insertCell(3);
			emptyRow.insertCell(4);


			var img = document.createElement("IMG");
			img.src = "resources/images/plus-button.png";
			img.id = "add-assignment-button";
			img.className = "plus-button";
			img.addEventListener("click", function()
			{
				that.controller.createAddAssignmentModal();
			});
			iconCell.appendChild(img);
		}
	}







	show()
	{
		var menuPanel = document.getElementById("menupanel-teacher");
		menuPanel.style.display = "block";
		super.show();
	}
}
