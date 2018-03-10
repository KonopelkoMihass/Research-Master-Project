/**Responsible for displaying what the user sees**/
class SeeSubmissionsTeacherView extends View
{
	constructor(controller)
	{
		super();

		this.title = app.viewManager.VIEW.SEE_SUBMISSIONS_TEACHER;
		this.controller = controller;
		this.setup();
	}


	showSubmissions(assignmentID)
	{
		var submissionsTable = document.getElementById("teacher-submissions-table");

		// remove all data in there.
		var rowCount = submissionsTable.rows.length;
		while (--rowCount) {
			submissionsTable.deleteRow(rowCount);
		}

		var submissions = app.submissions.submissions;

		var rowIndex = 0;
		for (var i = 0; i < submissions.length; i++) {
			var submission = submissions[i];


            if (submission.assignmentID === assignmentID)
            {
				var row = submissionsTable.insertRow(rowIndex + 1);
				var cell0 = row.insertCell(0);
				cell0.innerHTML = submissions[i].userData.name + " " + submissions[i].userData.surname;
				cell0.id = "see-submission-teacher#" + submissions[i].id + "#" + submissions[i].iteration;

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
				var feedbacks = submission.feedbacks;
				for (var j = 0; j < feedbacks.length; j++)
				{
					if (feedbacks[j].reviewer_id === app.user.id)
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

	onNotify (model, messageType)
	{
		var view = this;

		// Update the table of assessments
		if (messageType === app.net.messageHandler.types.GET_SUBMISSIONS_SUCCESSFUL ||
			messageType === app.net.messageHandler.types.SUBMIT_ASSIGNMENT_SUCCESSFUL) {
            var assignmentsTable = document.getElementById("teacher-assignments-submissions-table");

            // remove all data in there.
            var rowCount = assignmentsTable.rows.length;
            while (--rowCount) {
                assignmentsTable.deleteRow(rowCount);
            }
            var assignments = app.assignments.assignments;
			var submissions = model.submissions;


            for (var i = 0; i < assignments.length; i++) {
            	var hasSubmissions = false;

            	if (assignments[i].status === "completed")
            	{
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
						cell0.id = "see-assignment-submissions-teacher#" + assignments[i].id;
						cell0.addEventListener("click", function () {
							view.showSubmissions(parseInt(this.id.split("#")[1]));
						});
					}

				}
            }
        }
	}


	show()
	{
		super.show();
	}
}
