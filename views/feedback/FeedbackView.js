/**Responsible for displaying what the user sees**/
class FeedbackView extends View
{
	constructor(controller)
	{
		super();

		this.title = app.viewManager.VIEW.FEEDBACK;
		this.controller = controller;
		this.setup();
	}

	onNotify (model, messageType)
	{
		var view = this;

		// Update the table of assessments
		if (messageType === app.net.messageHandler.types.GET_SUBMISSIONS_SUCCESSFUL)
		{
            var submissionsTable = document.getElementById("student-assignment-feedback-table");

            // remove all data in there.
            var rowCount = submissionsTable.rows.length;
            while (--rowCount) {
                submissionsTable.deleteRow(rowCount);
            }

            var assignments = app.assignments.assignments;
            var submissions = model.submissions;


            for (var i = 0; i < submissions.length; i++)
            {

                var row = submissionsTable.insertRow(i + 1);



                var cell0 = row.insertCell(0);
                for (var j = 0; j < assignments.length; j++)
                {
                	if (submissions[i].assignmentID === assignments[j].id)
                	{
                		cell0.innerHTML = assignments[j].name;
					}
                }



                cell0.id = "see-student-assignment-feedback#" + assignments[i].id;


                cell0.addEventListener("click", function () {
                    view.createReviewSelectModal(parseInt(this.id.split("#")[1]), this.innerHTML);
                });
            }
        }
	}

	createReviewSelectModal(submissionID, assignmentName)
	{
		var modalBody = app.modalContentManager.getModalContent("select-review-student");
		var modalData = app.uiFactory.createModal("select-review-student", assignmentName + " - Select Feedback to View", modalBody, false);
		document.body.appendChild(modalData.modal);

		var submissions = this.controller.model.submissions;
		var submission = undefined;
		for (var i = 0; i < submissions.length; i++)
		{
			if (submissions[i].id === submissionID)
			{
				submission = submissions[i];
			}
		}

		var latestFeedback = submission.feedbacks[submission.feedbacks.length - 1];


		var table = document.getElementById("select-review-student-feedback-table");
		var rowIndex = 0;
		for (var userID in latestFeedback)
		{
			var row = table.insertRow(rowIndex + 1);
			var feedback = latestFeedback[userID];

			var cell0 = row.insertCell(0);
			cell0.innerHTML = userID;

			var cell1 = row.insertCell(1);
			cell1.innerHTML = "Press here to see review";

			cell1.id = "select-review-student-feedback-row#" + submission.id + "#" + userID;
			cell1.addEventListener("click", function () {

				var parentNode = modalData.modal.parentNode;
				parentNode.removeChild(modalData.modal);


				app.submissions.codeViewState = "Comments";
				app.submissions.reviewerIDToCodeView = parseInt(this.id.split('#')[2]);
				app.submissions.submissionIDToCodeView = parseInt(this.id.split('#')[1]);
				app.viewManager.goToView(app.viewManager.VIEW.CODE_VIEW);

			});
			rowIndex++;
		}




		modalData.modal.style.display = "block";

	}



	show()
	{
		super.show();
	}
}
