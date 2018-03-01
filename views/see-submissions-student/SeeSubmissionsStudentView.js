/**Responsible for displaying what the user sees**/
class SeeSubmissionsStudentView extends View
{
	constructor(controller)
	{
		super();

		this.title = app.viewManager.VIEW.SEE_SUBMISSIONS_STUDENT;
		this.controller = controller;
		this.setup();
	}

	onNotify (model, messageType)
	{
		var view = this;

		// Update the table of assessments
		if (messageType === app.net.messageHandler.types.GET_SUBMISSIONS_SUCCESSFUL ||
			messageType === app.net.messageHandler.types.SUBMIT_ASSIGNMENT_SUCCESSFUL)
		{
			var submissionsTable = document.getElementById("student-submissions-table");

			// remove all data in there.
			var rowCount = submissionsTable.rows.length;
			while(--rowCount)
			{
				submissionsTable.deleteRow(rowCount);
			}

			var allSubmissions = model.submissions;
			var submissions = [];
			for (var i = 0; i < allSubmissions.length; i++)
			{
				if (allSubmissions[i].userID === app.user.id)
				{
					submissions.push(allSubmissions[i]);
				}
			}



			var assignments = app.assignments.assignments;

			for (var i = 0; i < submissions.length; i++)
			{
				var row = submissionsTable.insertRow(i + 1);

				var name = "";

				for (var j = 0; j < assignments.length; j++)
				{
					if (assignments[j].id === submissions[i].assignmentID){
						name = assignments[j].name;
					}
				}

				var cell0 = row.insertCell(0);
				cell0.innerHTML = name;
				cell0.id = "see-submission-student#" + submissions[i].id;
				cell0.addEventListener("click", function()
				{
					app.submissions.codeViewState = "Clear";
					app.submissions.submissionIDToCodeView = parseInt(this.id.split('#')[1]);
					app.submissions.reviewerIDToCodeView = -1;

					app.viewManager.goToView(app.viewManager.VIEW.CODE_VIEW);
				});



			}
		}
	}


	show()
	{
		super.show();
	}
}
