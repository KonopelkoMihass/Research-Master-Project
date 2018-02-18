/**Responsible for displaying what the user sees**/
class AssignmentsStudentView extends View
{
	constructor(controller)
	{
		super();

		this.title = app.viewManager.VIEW.ASSIGNMENTS_STUDENT;
		this.controller = controller;
		this.setup();

		this.tickAreas = {}
	}


	onNotify (model, messageType)
	{
		var that = this;

		// Update the table of assessments
		if (messageType === app.net.messageHandler.types.GET_ASSIGNMENTS_SUCCESSFUL ||
			messageType === app.net.messageHandler.types.ASSIGNMENT_DELETE_SUCCESSFUL )
		{
			var assignmentTable = document.getElementById("student-assignments-table");

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
				img.src = "resources/images/upload-button.png";
				img.id = "upload-assignment-button##" + assignments[i].id;
				img.className = "picture-button";
				img.addEventListener("click", function()
				{
					var id = parseInt(this.id.split('##')[1]);
					that.controller.createSubmitAssignmentModal(id);
				});
				cell0.appendChild(img);


				cell1.innerHTML = assignments[i].name;
				cell2.innerHTML = assignments[i].deadlineDate;
				cell3.innerHTML = assignments[i].deadlineTime;
				cell4.id = "assignment-submission##" + assignments[i].id;

				this.tickAreas[assignments[i].id] = cell4;



			}
		}

		else if (messageType === app.net.messageHandler.types.GET_SUBMISSIONS_SUCCESSFUL ||
				messageType === app.net.messageHandler.types.SUBMIT_ASSIGNMENT_SUCCESSFUL)
		{
			// Clean all ticks
			for(var k in this.tickAreas) {
				this.tickAreas[k].innerHTML = "";
			}

			// Optimise submissions - we need them as dict of assignment_id linking to a freshest submission_id
			var organisedSubData = {};
			for (var i = 0; i < model.submissions.length; i++)
			{
				organisedSubData[model.submissions[i].assignment_id] = model.submissions[i].id;
			}


			for(var assID in organisedSubData)
			{
  				var subID = organisedSubData[assID];

  				var cell = this.tickAreas[assID];

  				//Set tick image and button.
				var subImg = document.createElement("IMG");
				subImg.src = "resources/images/tick.png";
				subImg.className = "picture-button";
				subImg.id = "submission-picture##" + subID;

				subImg.addEventListener("click", function()
				{
					var id = parseInt(this.id.split('##')[1]);
					console.log("MAY TRANSPORT YOU TO SUB", id, "Someday");
				});

  				cell.appendChild(subImg);
			}
		}
	}

	show()
	{
		super.show();
	}
}
