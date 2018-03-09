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

		var assignmentTable = document.getElementById("student-assignments-table");
		var reviewDeadlineTable = document.getElementById("student-assignments-review-deadlines-table");

		// Update the table of assessments
		if (messageType === app.net.messageHandler.types.GET_ASSIGNMENTS_SUCCESSFUL ||
			messageType === app.net.messageHandler.types.ASSIGNMENT_DELETE_SUCCESSFUL  )
		{
			// remove all data in there.
			var rowCount = assignmentTable.rows.length;
			while(--rowCount)
			{
				assignmentTable.deleteRow(rowCount);
			}



			var assignments = model.assignments;

			for (var i = 0; i < assignments.length; i++)
			{
				var status = assignments[i].status;
				var row = 0;
				var dlTime = 0;
				var dlDate = 0;

				if (status === "normal" || status === "submission_soon")
				{
					row = assignmentTable.insertRow(assignmentTable.rows.length);
					dlTime = assignments[i].deadlineTime;
					dlDate = assignments[i].deadlineDate;
				}

				else{
					continue;
				}


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
				cell2.innerHTML = dlDate;
				cell3.innerHTML = dlTime;

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
				if (model.submissions[i].userID === app.user.id)
				{
					organisedSubData[model.submissions[i].assignmentID] = model.submissions[i];
				}
			}


			for(var assID in organisedSubData)
			{

  				var subID = organisedSubData[assID].id;

  				var cell = this.tickAreas[assID];

  				if(cell !== undefined)
  				{
					//Set tick image and button.
					var subImg = document.createElement("IMG");
					subImg.src = "resources/images/tick.png";
					subImg.className = "picture-button";
					subImg.id = "submission-picture##" + subID;

					subImg.addEventListener("click", function()
					{
						var id = parseInt(this.id.split('##')[1]);
						alert("Hi there!");
					});

					cell.appendChild(subImg);
  				}

  				//Lets see if there is a sell with where I can put a version in?
				var cell = document.getElementById("assignment-submission-iteration##" + assID);
  				if (cell)
  				{
  					cell.innerHTML = organisedSubData[parseInt(assID)].iteration;
				}

			}
		}

		// update review section
		rowCount = reviewDeadlineTable.rows.length;
		while(--rowCount)
		{
			reviewDeadlineTable.deleteRow(rowCount);
		}

		var assignments = app.assignments.assignments;

		for (var i = 0; i < assignments.length; i++)
		{

				if (assignments[i].status === "review" || assignments[i].status === "review_end_soon")
			{

				// Student should not be able to re submit code if he have not submitted it initially.
				var submissions = app.submissions.submissions;
				var submissionPresent = false;
				var submission = {};

				for (var j = 0; j < submissions.length; j++)
				{
					if (submissions[j].assignmentID === assignments[i].id)
					{
						submissionPresent = true;
						submission = submissions[j];
					}
				}
				if (submissionPresent === false)
				{
					continue;
				}


				var row = reviewDeadlineTable.insertRow(reviewDeadlineTable.rows.length);

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
				cell2.innerHTML = assignments[i].reviewTillDate;
				cell3.innerHTML = assignments[i].reviewTillTime;

				cell4.id = "assignment-submission-iteration##" + assignments[i].id;
				cell4.innerHTML = submission.iteration;
			}
		}
	}

	show()
	{
		super.show();
	}
}
