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
            if (submissions[i].assignmentID === assignmentID)
            {
				var row = submissionsTable.insertRow(rowIndex + 1);
				var cell0 = row.insertCell(0);
				cell0.innerHTML = submissions[i].userData.name + " " + submissions[i].userData.surname;
				cell0.id = "see-submission-teacher#" + submissions[i].id;
				cell0.addEventListener("click", function () {
					app.submissions.codeViewState = "Review";
					app.submissions.submissionIDToCodeView = parseInt(this.id.split('#')[1]);
					app.viewManager.goToView(app.viewManager.VIEW.CODE_VIEW);
				});
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

            for (var i = 0; i < assignments.length; i++) {
                var row = assignmentsTable.insertRow(i + 1);

                var cell0 = row.insertCell(0);
                cell0.innerHTML = assignments[i].name;
                cell0.id = "see-assignment-submissions-teacher#" + assignments[i].id;
                cell0.addEventListener("click", function () {
                    view.showSubmissions(parseInt(this.id.split("#")[1]));
                });
            }
        }









			/*

			for (var i = 0; i < submissions.length; i++)
			{
				var row = assignmentsTable.insertRow(i + 1);

				var name = "";

				for (var j = 0; j < assignments.length; j++)
				{
					if (assignments[j].id === submissions[i].assignmentID){
						name = assignments[j].name;
					}
				}

				var cell0 = row.insertCell(0);
				cell0.innerHTML = name;
				cell0.id = "see-submission-teacher#" + submissions[i].id;
				cell0.addEventListener("click", function()
				{
					app.submissions.codeViewState = "Clear";
					app.submissions.submissionIDToCodeView = parseInt(this.id.split('#')[1]);
					app.viewManager.goToView(app.viewManager.VIEW.CODE_VIEW);
				});



			}*/


	}


	show()
	{
		super.show();
	}
}
