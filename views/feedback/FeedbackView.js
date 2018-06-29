/**Responsible for displaying what the user sees**/
class FeedbackView extends View
{
	constructor(controller)
	{
		super();

		this.title = app.viewManager.VIEW.FEEDBACK;
		this.controller = controller;
		this.setup();

		this.spaceShipLives = 3; // How many lives ship has.  Each issue takes one live.
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
			var submissions = model.submissions;
			var subIns = [];
			for (var i = 0; i < submissions.length; i++)
			{
				// if he is an owner - then he is the one to see these.
				if (submissions[i].userID === app.user.id)
				{
					var submission = submissions[i];
					var currentFeedbacksIDs = [];

					for (var k = 0;k < submission.feedbacks.length; k++)
					{
						if (submission.feedbacks[k].iteration_submitted === submission.iteration)
						{
							subIns.push(i);
							break;
						}
					}
				}
			}


			var rowIndex = 0;
            for (var i = 0; i < subIns.length; i++)
            {
            	if (submissions[subIns[i]].feedbacks.length !== 0)
            	{
					var row = submissionsTable.insertRow(rowIndex + 1);

					var cell0 = row.insertCell(0);
					for (var j = 0; j < assignments.length; j++)
					{
						if (submissions[subIns[i]].assignmentID === assignments[j].id)
						{
							cell0.innerHTML = assignments[j].name;
						}
					}

					cell0.id = "see-student-assignment-feedback#" + subIns[i];
					cell0.addEventListener("click", function ()
					{
						view.createReviewSelectModal(parseInt(this.id.split("#")[1]), this.innerHTML);
					});
					rowIndex++;
				}
            }
        }
	}

	createReviewSelectModal(subIndex, assignmentName)
	{
		var that = this;

		var modalBody = app.modalContentManager.getModalContent("select-review-student");
		var modalData = app.uiFactory.createModal("select-review-student", assignmentName + " - Select Feedback to View", modalBody, false);
		document.body.appendChild(modalData.modal);

		var modalSpaceGame = app.modalContentManager.getModalContent("rocket-game");
		var modalSpaceGameData = app.uiFactory.createModal("select-review-student", "Rocket Test", modalSpaceGame, false);
		document.body.appendChild(modalSpaceGameData.modal);


		var submission = app.submissions.submissions[subIndex];

		var currentFeedbacksIDs = [];
		for (var i = 0;i< submission.feedbacks.length; i++)
		{
			if (submission.feedbacks[i].iteration_submitted === submission.iteration)
			{
				var feedback = submission.feedbacks[i];
				// test if there are no feedback from a same user on a same iteration
				var foundUser = false;
				for (var j = 0; j< currentFeedbacksIDs.length; j++)
				{
					if (currentFeedbacksIDs[j].reviewer_id === feedback.reviewer_id && currentFeedbacksIDs[j].iteration_submitted === feedback.iteration_submitted)
					{
                        foundUser = true;
                        break;
                    }
				}
				if(foundUser)
				{
					currentFeedbacksIDs[j] = i;
				}
				else
				{
					currentFeedbacksIDs.push(i);
				}
			}
		}



		var reviewDiv = document.getElementById("select-review-students-buttons");

		for (var i = 0; i < currentFeedbacksIDs.length; i++)
		{
			var fbdata = submission.feedbacks[currentFeedbacksIDs[i]];

			var reviewBtn = document.createElement("BUTTON");

			if (fbdata.reviewer_role === "student")
			{
				reviewBtn.innerHTML ="Some Review by " + fbdata.reviewer_name;
			}

			else
			{
				reviewBtn.innerHTML ="Review by the Lecturer " + fbdata.reviewer_name;
				reviewBtn.style="font-weight:bold"
			}



			reviewBtn.id = "select-review-student-feedback-row#" + submission.id + "#" + fbdata.reviewer_id + "#" + currentFeedbacksIDs[i];


			reviewBtn.addEventListener("click", function ()
			{
				var parentNode = modalData.modal.parentNode;
				parentNode.removeChild(modalData.modal);



				modalSpaceGameData.modal.style.display = "block";

				app.submissions.codeViewState = "Comments";
				app.submissions.reviewerIDToCodeView = parseInt(this.id.split('#')[2]);
				app.submissions.submissionIDToCodeView = parseInt(this.id.split('#')[1]);
				app.submissions.feedbackIndexToReview = parseInt(this.id.split('#')[3]);

				var feedback = submission.feedbacks[app.submissions.feedbackIndexToReview];

				that.setupRocketGame(modalSpaceGameData, feedback);


			});

			reviewDiv.appendChild(reviewBtn);
		}



		modalData.modal.style.display = "block";
	}



	show()
	{
		super.show();
	}

	setupRocketGame(gameModalData, feedback)
	{
		var modalBody = gameModalData.modal;
		var closeButtons = gameModalData.closes;



        console.log ("feedback", feedback);
        var whoReviewed = feedback.reviewer_role;


		var issues = [];

		var review = feedback["review"];
		for (var filename in review)
		{
			var fileReview = review[filename];
			for (var bitID in fileReview)
			{
				if (fileReview[bitID].review_type === "Issue")
				{
					var issue = {};
					issue.file = filename;
					issue.review = fileReview[bitID].review;
					issues.push(issue)
				}
			}
		}


		// Determines the fate of the ship.
		var shipFate = "fly off";
		if (issues.length >= this.spaceShipLives)
		{
			shipFate = "fly and explode";
		}

		if (issues.length >= this.spaceShipLives * 2)
		{
			shipFate = "explode";
		}

		//Do prep here

		this.startCountdown(shipFate, issues, closeButtons, whoReviewed)


	}

	startCountdown(shipFate, issues, closeButtons, whoReviewed)
	{
		var that = this;
		var messageLog = document.getElementById("messages-window");

		var prestartMessage = document.createElement("LABEL");

		if (whoReviewed === "student"){
			prestartMessage.innerHTML = "The spaceship simulation will start in:";
		}

		else
		{
			prestartMessage.innerHTML = "The launch of the spaceship will commence in:";
		}

		messageLog.appendChild(prestartMessage);

		var timeLeft = 10;
		var timer = setInterval(function()
			{
				var countMessage = document.createElement("LABEL");
				countMessage.innerHTML = timeLeft;
				messageLog.appendChild( document.createElement("BR"));
				messageLog.appendChild(countMessage);


				timeLeft--;


				if (timeLeft === 5){
					app.audioManager.playSound("space-ship-flight.wav", 1);
				}


				if (timeLeft === -1)
				{
					clearInterval(timer);
					that.rocketFlight(shipFate,issues, messageLog, closeButtons, whoReviewed)
                }

			}, 1000);

			// Clicking close buttons should bring to the code view
		 for (var i = 0; i <closeButtons.length;i++){
			closeButtons[i].addEventListener("click", function ()
			{
				app.viewManager.goToView(app.viewManager.VIEW.CODE_VIEW);
				clearInterval(timer);
			});
        }



	}

	rocketFlight(shipFate,issues, messageLog, closeButtons, whoReviewed)
	{
		var that = this;
		var rocket = document.getElementById("spaceship-span");
		var rocketSprite = document.getElementById("rocket-image");


		if (shipFate === "explode")
		{
			//Explode
			rocketSprite.src="resources/images/explosion.png";
			rocketSprite.classList.remove("rocket-image");
			rocketSprite.classList.add("explosion-image");

			if(whoReviewed === "student")
			{
				var lastmessage = document.createElement("LABEL");
				lastmessage.innerHTML = "Simulation was cancelled due to a severe number of errors.";
				lastmessage.style.color = "red";
				messageLog.appendChild(document.createElement("BR"));
				messageLog.appendChild(lastmessage)
			}

			else{
				var lastmessage = document.createElement("LABEL");
				lastmessage.innerHTML = "Contact was lost.  No signal from the ship.  We lost it.";
				lastmessage.style.color = "red";
				messageLog.appendChild(document.createElement("BR"));
				messageLog.appendChild(lastmessage)
			}

		}

		else
		{
			rocket.classList.add("fly");
			rocketSprite.src="resources/images/spaceship-flying.png";

			var explosionCount = 0;
			var flyStages = 0;

			var timer = setInterval(function()
				{
					flyStages++;

					if (issues.length > explosionCount)
					{
						var issue = issues[explosionCount];
						explosionCount++;

						var message = document.createElement("LABEL");
						message.innerHTML = "Error #" + explosionCount +" has occurred in file " + issue.file;
						message.style.color = "red";


						messageLog.appendChild(document.createElement("BR"));
						messageLog.appendChild(message);

						if (explosionCount < 3)
						{
							rocketSprite.src = "resources/images/spaceship-damage"+explosionCount+".png";
						}

						else
						{
							//Explode
							rocketSprite.src="resources/images/explosion.png";

							rocketSprite.classList.add("explosion-image");
							rocketSprite.classList.remove("rocket-image");

							if(whoReviewed === "student")
							{
								var lastmessage = document.createElement("LABEL");
								lastmessage.innerHTML = "Simulation has ended with failure.";
								lastmessage.style.color = "red";
								messageLog.appendChild(document.createElement("BR"));
								messageLog.appendChild(lastmessage)
							}

							else{
								var lastmessage = document.createElement("LABEL");
								lastmessage.innerHTML = "Contact was lost.  No signal from the ship.  We lost it.";
								lastmessage.style.color = "red";
								messageLog.appendChild(document.createElement("BR"));
								messageLog.appendChild(lastmessage)
							}
						}
					}

					else
					{
						if (flyStages === 3){

							rocket.classList.add("flyOff");

							if(whoReviewed === "student")
							{
								var lastmessage = document.createElement("LABEL");
								lastmessage.innerHTML = "Simulation has ended with success" ;
								lastmessage.style.color = "white";
								messageLog.appendChild(document.createElement("BR"));
								messageLog.appendChild(lastmessage)
							}
							else
							{
								var lastmessage = document.createElement("LABEL");
								lastmessage.innerHTML = "Spaceship have passed the atmosphere and successfully goes to an orbit" ;
								lastmessage.style.color = "white";
								messageLog.appendChild(document.createElement("BR"));
								messageLog.appendChild(lastmessage)
							}
						}
					}


					if (flyStages === 5)
					{
						closeButtons[0].click();
					}


				}, 3000);



				// Clicking close buttons should bring to the code view
			 for (var i = 0; i <closeButtons.length;i++){
				closeButtons[i].addEventListener("click", function ()
				{
					app.viewManager.goToView(app.viewManager.VIEW.CODE_VIEW);
					clearInterval(timer);
				});
			}


		}








	}

}
