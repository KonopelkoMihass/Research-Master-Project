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

		// Update the table of assignments
		if (messageType === app.net.messageHandler.types.GET_SUBMISSIONS_SUCCESSFUL)
		{
            var submissionsTable = document.getElementById("student-assignment-feedback-table");

            // remove all data in there.
            var rowCount = submissionsTable.rows.length;
            while (--rowCount) {
                submissionsTable.deleteRow(rowCount);
            }

            var assignments = app.assignments.assignments;
			var allSubmissions = model.submissions;
			var submissions = [];
			for (var i = 0; i < allSubmissions.length; i++)
			{
				// if he is an owner - then he is the one to see these.
				if (allSubmissions[i].userID === app.user.id)
				{
					submissions.push(allSubmissions[i]);
				}
			}


			var rowIndex = 0;
            for (var i = 0; i < submissions.length; i++)
            {
            	if (submissions[i].feedbacks.length !== 0)
            	{
					var row = submissionsTable.insertRow(rowIndex + 1);

					var cell0 = row.insertCell(0);
					for (var j = 0; j < assignments.length; j++)
					{
						if (submissions[i].assignmentID === assignments[j].id)
						{
							cell0.innerHTML = assignments[j].name;
						}
					}

					cell0.id = "see-student-assignment-feedback#" + assignments[i].id;
					cell0.addEventListener("click", function ()
					{
						view.createReviewSelectModal(parseInt(this.id.split("#")[1]), this.innerHTML);
					});
					rowIndex++;
				}
            }
        }
	}

	createReviewSelectModal(assignmentID, assignmentName)
	{
		var modalBody = app.modalContentManager.getModalContent("select-review-student");
		var modalData = app.uiFactory.createModal("select-review-student", assignmentName + " - Select Feedback to View", modalBody, false);
		document.body.appendChild(modalData.modal);





		var submissions = this.controller.model.submissions;
		var submission = undefined;
		for (var i = 0; i < submissions.length; i++)
		{
			if (submissions[i].assignmentID === assignmentID)
			{
				if (submissions[i].userID === app.user.id)
				{
					submission = submissions[i];
				}
			}
		}


		for (var i = 0; i < submission.feedbacks.length; i++)
		{
			var feedback = submission.feedbacks[i];
			var reviewDiv = document.getElementById("select-review-students-buttons");

			for (var userID in feedback)
			{
				var fbdata = feedback[userID];

				var reviewBtn = document.createElement("BUTTON");
				reviewBtn.innerHTML ="Review by " + fbdata.reviewer_name;
				reviewBtn.id = "select-review-student-feedback-row#" + submission.id + "#" + userID;


				reviewBtn.addEventListener("click", function () {
					var parentNode = modalData.modal.parentNode;
					parentNode.removeChild(modalData.modal);

					app.submissions.codeViewState = "Comments";
					app.submissions.reviewerIDToCodeView = parseInt(this.id.split('#')[2]);
					app.submissions.submissionIDToCodeView = parseInt(this.id.split('#')[1]);
					app.viewManager.goToView(app.viewManager.VIEW.CODE_VIEW);
				});

				reviewDiv.appendChild(reviewBtn);
			}
		}


		modalData.modal.style.display = "block";
	}



	show()
	{
		super.show();
	}
}
