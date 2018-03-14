/**Responsible for displaying what the user sees**/
class PerformReviewStudentView extends View
{
	constructor(controller)
	{
		super();

		this.title = app.viewManager.VIEW.PERFORM_REVIEW_STUDENT;
		this.controller = controller;
		this.setup();
		this.selectedSub = "";
	}



	onNotify (model, messageType)
	{
		var view = this;

		// Update the table of assessments
		if (messageType === app.net.messageHandler.types.GET_SUBMISSIONS_SUCCESSFUL ||
			messageType === app.net.messageHandler.types.SUBMIT_ASSIGNMENT_SUCCESSFUL) {
            var assignmentsTable = document.getElementById("student-assignments-submissions-table");

            // remove all data in there.
            var rowCount = assignmentsTable.rows.length;
            while (--rowCount) {
                assignmentsTable.deleteRow(rowCount);
            }
            var assignments = app.assignments.assignments;

			var allSubmissions = model.submissions;
			var submissions = [];
			for (var i = 0; i < allSubmissions.length; i++)
			{
				// if he is not an owner - then he is the one to review these.
				if (allSubmissions[i].userID !== app.user.id)
				{
					submissions.push(allSubmissions[i]);
				}
			}

			for (var i = 0; i < assignments.length; i++)
			{
				if (assignments[i].status !== "completed")
				{
					var hasSubmissions = false;
					for (var j = 0; j < submissions.length; j++) {
						if (assignments[i].id === submissions[j].assignmentID)
						{
							hasSubmissions = true;
						}
					}

					if (hasSubmissions)
					{
						var row = assignmentsTable.insertRow(assignmentsTable.rows.length);

						var cell0 = row.insertCell(0);
						cell0.innerHTML = assignments[i].name;
						cell0.id = "see-assignment-submissions-student#" + assignments[i].id;
						cell0.addEventListener("click", function () {

							if (view.selectedSub !== "")
							{
								view.selectedSub.classList.remove("sub-selected");
							}

							this.classList.add("sub-selected");
							view.selectedSub = this;


							view.showSubmissions(parseInt(this.id.split("#")[1]));
						});
					}
				}
            }
        }
	}



	showSubmissions(assignmentID)
	{
		var submissionsTable = document.getElementById("student-submissions-to-review-table");

		// remove all data in there.
		var rowCount = submissionsTable.rows.length;
		while (--rowCount) {
			submissionsTable.deleteRow(rowCount);
		}

		var allSubmissions = app.submissions.submissions;
		var submissions = [];
		for (var i = 0; i < allSubmissions.length; i++)
		{
			if (allSubmissions[i].userID !== app.user.id)
			{
				submissions.push(allSubmissions[i]);
			}
		}

		var rowIndex = 0;

		for (var i = 0; i < submissions.length; i++) {
			var submission = submissions[i];

            if (submission.assignmentID === assignmentID)
            {
				var row = submissionsTable.insertRow(rowIndex + 1);
				var cell0 = row.insertCell(0);
				cell0.innerHTML = "Submission No. " + (rowIndex+1);
				cell0.id = "see-submission-teacher#" + submissions[i].id + "#" + submission.iteration;
				cell0.addEventListener("click", function () {
					app.submissions.codeViewState = "Review";
					app.submissions.submissionIDToCodeView = parseInt(this.id.split('#')[1]);
					app.submissions.reviewerIDToCodeView = app.user.id;
					app.submissions.iterationReviewed = parseInt(this.id.split('#')[2]);

					app.viewManager.goToView(app.viewManager.VIEW.CODE_VIEW);


					var rowCount = submissionsTable.rows.length;
					while (--rowCount) {
						submissionsTable.deleteRow(rowCount);
					}
				});


				var cell1 = row.insertCell(1);


				// Check if feedback was already submitted by this user.
				// if he is an owner - then he is the one to see these.

				for (var k = 0;k < submission.feedbacks.length; k++)
				{
					if (submission.feedbacks[k].iteration_submitted === submission.iteration)
					{
						var img = document.createElement("IMG");
						img.src = "resources/images/tick.png";
						img.className = "picture-button";
						cell1.appendChild(img);

					}

				}



				rowIndex++;
			}

		}
	}











































	show()
	{
		super.show();
	}
}
