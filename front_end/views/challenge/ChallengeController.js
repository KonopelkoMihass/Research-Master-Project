class ChallengeController
{
	constructor(model)
	{
		this.model = model;
		this.setup();
		this.parsedCodeHTMLs = {};

		this.setSideModal = true;

		this.categoryElemSelected = "";
		this.codeBitReviewed = "";
		this.codeElementIdReviewed = "";
		this.fileOpened = "";

		this.fileNameParsed = "";
		this.allowSelection = true;

		this.issuesFound = {};

		this.seconds = 0;
		this.minutes = 0;

		this.timer = undefined;
		this.displayPostChallengeScreen = false;

		this.altered = false;

		this.finishedChallenge = false;
	}

	setup()
	{ }

	sortCategories(standards)
    {
        var stdNumber = 0;
        var sortedKeys = [];
        var totalCategories = Object.keys(standards).length;

        while(true){
            for (var key in standards) {
                for (var i = 0; i < standards[key].length; i++) {
                    if (stdNumber == standards[key][i].number)
                    {
                        sortedKeys.push(key);
                        stdNumber += standards[key].length;
                    }
                }
            }
            if (Object.keys(sortedKeys).length === totalCategories)
            {
                break;
            }
        }

        return sortedKeys;
    }

	setupSideModal()
	{
		var controller = this;

        var standards =  app.standards.selectStandards(this.model.standard);
        var difficulty = this.model.difficulty;


        var categorySelectDiv = document.getElementById("challenge-code-category-select-div");
        categorySelectDiv.innerHTML = "";

        var sortedKeys = this.sortCategories(standards);

        for (var k = 0; k < sortedKeys.length; k++)
        {
            var key = sortedKeys[k];

            if (!app.standards.checkIfEnabled(standards[key]) ) continue;

            if (difficulty === "easy") {
                if (!this.model.doesContainThisStandardCategory(key)) continue;
            }

            else if (difficulty === "mixed" || difficulty === "hard"){
                if (!app.user.isCategoryKnown(this.model.standard, key, true)) continue;
            }

            else if (difficulty === "exam")
                if (!app.user.isCategoryKnown(this.model.standard, key, false)) continue;

            var categoryName = key;

            // create a span to insert into div
            var categorySpan = document.createElement("SPAN");
            categorySpan.id = "challenge-code-standard-category#" + categoryName;
            categorySpan.innerHTML = categoryName;
            categorySpan.className = "code-review-select-category-span";

            var subCategoryDiv = document.createElement("div");
            subCategoryDiv.id = "challenge-code-standard-subcategory-div#" + categoryName;

            categorySelectDiv.appendChild(categorySpan);
            categorySelectDiv.appendChild(subCategoryDiv);

            categorySpan.addEventListener("click", function ()
            {
                var localSubCategoryDiv = document.getElementById("challenge-code-standard-subcategory-div#" + this.id.split("#")[1]);
                // clean sub category
                if (localSubCategoryDiv.innerHTML !== "")
                {
                    localSubCategoryDiv.innerHTML = "";
                }

                else
                {
                    if (controller.categoryElemSelected !== "")
                    {
                        controller.categoryElemSelected.classList.remove("standard-bit-selected");
                    }
                    controller.categoryElemSelected = this;
                    controller.categoryElemSelected.classList.add("standard-bit-selected");

                    var cat = this.id.split("#")[1];
                    var subcategories = standards[cat];


                    var getStdByNumber = function(subCategories, i) {
                        var startValue = 99999;
                        for (var j = 0; j < subCategories.length; j++) {
                            var num = subCategories[j].number;
                            num < startValue ? startValue = num : startValue = startValue;
                        }
                        for (var j = 0; j < subCategories.length; j++) {
                            if (subCategories[j].number === startValue + i) return subCategories[j];
                        }
                    };


                    for (var i = 0; i < subcategories.length; i++)
                    {
                        var subcategory = getStdByNumber(subcategories, i);

                        if (subcategory.enabled === "no") continue;

                        if (difficulty === "easy") {
                            if (!controller.model.doesContainThisStandardSubCategory(subcategory.number)) continue;
                        }

                        else if (difficulty === "mixed" || difficulty === "hard")
                        {
                            if (!app.user.isSubcategoryKnown(subcategory.number, true)) continue;
                        }

                        else {
                             if (!app.user.isSubcategoryKnown(subcategory.number, false)) continue;
                        }



                        var spanContainer = document.createElement("SPAN");

                        var subcategorySpan = document.createElement("SPAN");
                        subcategorySpan.id = "challenge-code-category#" + subcategory.category +"#" + subcategory.number;
                        subcategorySpan.className = "code-review-select-subcategory-span";

                        app.utils.insertTooltip(subcategorySpan, subcategory.description);

                        var img = document.createElement("IMG");
                        img.src = "resources/images/info.png";
                        img.id = "challenge-select-subcategory-tooltip#" + subcategory.category + "#" + subcategory.number;
                        img.className = "picture-button";
                        img.style.float = "right";

                        var label = document.createElement("LABEL");
                        label.id = "challenge-code-category#" + subcategory.category +"#" + subcategory.number + "#label";
                        label.innerHTML = subcategory.subCategory;

                        img.style.filter = "invert(0%)";
                        img.addEventListener("click",function ()
                        {
                            if (this.style.filter === "invert(0%)")
                            {
                                app.tracker.saveForLogs("tooltip_click", {});

                                this.style.filter = "invert(100%)";
                                var category = this.id.split("#")[1];
                                var idNum = this.id.split("#")[2];

                                var subCatSpan = document.getElementById("challenge-code-category#" + category + "#" + idNum);
                                var tootlipElem = subCatSpan.getElementsByClassName("tooltiptext")[0];

                                tootlipElem.style.visibility = "visible";
                                tootlipElem.style.opacity= "1";
                            }

                            else
                            {
                                this.style.filter = "invert(0%)";
                                var category = this.id.split("#")[1];
                                var idNum = this.id.split("#")[2];
                                var subCatSpan = document.getElementById("challenge-code-category#" + category + "#" + idNum);
                                var tootlipElem = subCatSpan.getElementsByClassName("tooltiptext")[0];
                                tootlipElem.style.visibility = "hidden";
                                tootlipElem.style.opacity= "0";
                            }
                        });

                        subcategorySpan.addEventListener("click", function ()
                        {
                            var lCategory =  this.id.split("#")[1];
                            var lSubCategory =  this.id.split("#")[2];
                            var resultStandard = app.standards.getStandard(lCategory, lSubCategory, app.challenge.language);

                            controller.closeSidenavAndSaveTheReview("issue", resultStandard);
                            subCategoryDiv.innerHTML = "";
                        });

                        subcategorySpan.appendChild(label);
                        spanContainer.appendChild(subcategorySpan);
                        spanContainer.appendChild(img);

                        localSubCategoryDiv.appendChild(spanContainer);
                    }
                }
            });
        }

	}

	cleanUp()
	{
		this.stopTimer();
		this.seconds = 0;
		this.minutes = 0;
		this.issuesFound = {};
		this.finishedChallenge = false;

		this.parsedCodeHTMLs = {};
		this.allFilesReview = {};

		document.getElementById("challenge-file-select").innerHTML = "";
		document.getElementById("challenge-code-review").innerHTML = "";
		document.getElementById("challenge-present-issues").innerHTML = "";
		document.getElementById("challenge-code-box").classList.remove("box");
		document.getElementById("challenge-code-box").classList.add("box-left");
		document.getElementById("challenge-code-box").scrollTop = 0;
		document.getElementById("challenge-submit-div").style.display = "block";



		var tutButton = document.getElementById("challenge-tutorial-button");
        var new_element = tutButton.cloneNode(true);
        tutButton.parentNode.replaceChild(new_element, tutButton);

        var reportButton = document.getElementById("challenge-report-error");
        new_element = reportButton.cloneNode(true);
        reportButton.parentNode.replaceChild(new_element, reportButton);


		if(!this.altered)
		{
		    document.getElementById("challenge-legend").innerText = "Training";
		    app.utils.assignFuncToButtonViaID("challenge-tutorial-button", function(){
		        location.href = "https://www.youtube.com/watch?v=OCwu7C6kE2M";
            });
        }

        else
        {
		     app.utils.assignFuncToButtonViaID("challenge-tutorial-button", function()
            {
			    location.href = "https://www.youtube.com/watch?v=OGdIyvn7bTY";
            });
        }

        var controller = this;
        app.utils.assignFuncToButtonViaID("challenge-report-error", function(){
            if (controller.finishedChallenge){
                var modalBody = app.modalContentManager.getModalContent("report-challenge-error");
		        var modalData = app.utils.createModal("report-challenge-error", "Report an error", modalBody, true);

                document.body.appendChild(modalData.modal);
                modalData.modal.style.display = "block";
                var closes = modalData.closes;
                for (var i = 0; i < closes.length; i++) {
                    closes[i].addEventListener("click", function () {
                        var oldEl = document.getElementById("challenge-submit");
                        var newEl = oldEl.cloneNode(true);
                        oldEl.parentNode.replaceChild(newEl, oldEl);
                    });
                }

                // fill the select box
                var selectTeacher = document.getElementById("report-challenge-error-select-teacher");

                var teachers = app.user.teachers;

                for (var i = 0; i < teachers.length; i++)
                {
                    var option = document.createElement("option");
                    option.text = teachers[i]["name"] + " " + teachers[i]["surname"];
                    option.value = teachers[i]["id"];
                    selectTeacher.add(option);
                }

                var submitBtn = modalData.submit;

                submitBtn.addEventListener("click", function ()
                {
                    var teacherSelector = document.getElementById("report-challenge-error-select-teacher");

                    var selectedTeacher = teacherSelector.options[teacherSelector.selectedIndex].value;
                    var text = document.getElementById("report-challenge-error-textarea").value;

                    var message = {};
                    message.reporter_name = app.user.name;
                    message.reporter_surname = app.user.surname;
                    message.text = text;
                    message.challenge_id = app.challenge.getChallengeId();
                    message.teacher_id = selectedTeacher;


                    app.net.sendMessage("report_error", message);
                    var parentNode = modalData.modal.parentNode;
			        parentNode.removeChild(modalData.modal);

                });






            }

            else{
                alert("Please complete the challenge, then report an error");
            }

        });







	}

	prepareCodeHTMLs()
	{
        // Get files and parse them into a highlighted HTML.  Then put them in a parsedCodeHTMLs.
		this.parsedCodeHTMLs["challenge"] = Prism.highlight(this.model.code, app.utils.derivePrismLanguage(this.model.language));

		// Now we insert it into a <code> area
		document.getElementById("challenge-code-review").innerHTML = this.parsedCodeHTMLs["challenge"];

		// Needed to restore line numbers
		Prism.highlightAllUnder(document.getElementById("challenge-precode-area"));
		this.fileOpened = "challenge";
		this.tweakCodeBlock("challenge", true);

		// Display issue types present.
        var divIssuePresents = document.getElementById("challenge-present-issues");

        var difficulty = this.model.difficulty;

        if (difficulty !== "exam")
        {
            divIssuePresents.style.display = "block";
            var issuesInfo = this.model.challengeIssueInformation;

            for (var i in issuesInfo) {
                divIssuePresents.innerHTML += issuesInfo[i] + "\n";
            }
        }

        else {
             divIssuePresents.innerHTML = "This is an exam.  Good luck!";
        }







    }

    markLinesPostChallenge()
    {
        /*var challengeIssues = this.model.issues;
        var lineNumSpans = document.getElementsByName("lineNumSpan");
    	for (var i = 0; i < lineNumSpans.length; i++ ) {
		    var line = lineNumSpans[i];
		    var id = line.id;

		    // element id can be a key in challengeIssues
            if (id in challengeIssues)
            {
                if (line.className === "")
                    line.className = "missed";

                else if (line.className === "selected")
                {

                }






            }

		    //codeElement.className = "";


        }*/
    }


	allowReview()
	{
		var controller = this;

		document.getElementById("challenge-submit-div").style.display = "block";

		var old_element = document.getElementById("challenge-submit");
        var new_element = old_element.cloneNode(true);
        old_element.parentNode.replaceChild(new_element, old_element);

		document.getElementById("challenge-submit").addEventListener("click", function ()
		{
		    controller.finishedChallenge = true;
			if (controller.displayPostChallengeScreen === false)
			{
			    controller.markLinesPostChallenge();
				controller.displayPostChallengeResult();
				controller.saveChallengeResults();
				controller.stopTimer();

				// disable delete buttons.
                var issueDeleteButtons = document.getElementsByName("issue-delete-button");
                var total = issueDeleteButtons.length;
                for (var i = 0; i < total; i++) issueDeleteButtons[0].remove();

				controller.displayPostChallengeScreen = true;

				document.getElementById("challenge-submit-legend").innerText = "Continue?";
			}
			else
			{
				if (controller.model.lastChallenge)
				{
					controller.showChallengeEndScreen();
				}
				else
				{
					controller.model.getChallenge();
				}
				controller.issuesFound = {};
				controller.standardUsed = "";
				controller.codingLanguageUsed = "";

				controller.displayPostChallengeScreen = false;
				document.getElementById("challenge-submit-legend").innerText = "Submit and see results?";
			}
		});
	}

	displayPostChallengeResult()
	{
		var issueTable = document.getElementById("challenge-data-table");
		var challengeIssues = Object.assign ({},this.model.issues);

		var correct = 0;
		var wrong = 0;

		for (var i = 1, row; row = issueTable.rows[i]; i++)
		{
			var answerCell = row.cells[3];

			var line = answerCell.id.split('#')[1];
			var answer = answerCell.id.split('#')[2];

			//Find that there is an error on this line
			var foundIssue = false;
			for (var j in challengeIssues)
			{
				if (challengeIssues[j].content == line)
				{
					if (challengeIssues[j].review == answer)
					{
						answerCell.innerHTML = "&#10004;";
						foundIssue = true;
						document.getElementById("codeLineID#"+line).className = "correct";
					}
				}
			}

			if (foundIssue)
			{
				var key = "codeLineID#"+line;
				correct++;
				delete challengeIssues[key];
			}
			else
			{
			    wrong++;
				answerCell.innerHTML = "X";
                document.getElementById("codeLineID#"+line).className = "mistake";
			}
		}

		if (Object.keys(challengeIssues).length > 0)
		{

			var headlineRow = issueTable.insertRow(-1);
			headlineRow.insertCell(0);
			headlineRow.insertCell(1);
			var c1 = headlineRow.insertCell(2);
			c1.innerHTML = "Issues you missed";

			for (var j in challengeIssues)
			{
				var std = challengeIssues[j].standard;

				var row = issueTable.insertRow(-1);
				var cell0 = row.insertCell(0);
				var cell1 = row.insertCell(1);
				var cell2 = row.insertCell(2);
				var cell3 = row.insertCell(3);

				cell1.innerHTML = challengeIssues[j].content;
				cell2.innerHTML = std.category + "\n" + std.subCategory;
				cell3.innerHTML = "&#9673;";
				cell3.style.textAlign="center";
				document.getElementById("codeLineID#"+challengeIssues[j].content).className = "missed";
			}
		}

		var missedCount = Object.keys(challengeIssues).length - wrong;
		app.tracker.saveForLogs("challenge completed",
			{"missed": missedCount ,
			 "correct": correct,
			 "wrong": wrong,});
	}

	saveChallengeResults()
	{
		var data = {};

		data.time = 60 * this.minutes + this.seconds;
		data.grade = this.model.calculateScore(this.issuesFound);

		this.model.saveResults(data);
		this.model.issues = {};


		// Calculating score
        var num = this.model.currentChallengeLink;

        var state = "" + Math.ceil(data.grade / 10);

		// Update the bar.
		app.utils.fillTheChallengeBar(state, num);
	}

	showChallengeEndScreen()
	{
		this.parsedCodeHTMLs = {};

		this.model.changeStdInternalisation();
		this.model.submitChallengeResults();

		var results = this.model.getOverallPerformance();

		var modalBody = app.modalContentManager.getModalContent("challenge-end");
		var modalData = app.utils.createModal("challenge-end", "Challenge Results", modalBody, false);

		document.body.appendChild(modalData.modal);
		modalData.modal.style.display = "block";
		var closes = modalData.closes;
		for (var i = 0; i < closes.length; i++)
		{
			closes[i].addEventListener("click", function ()
			{
				app.viewManager.goToView(app.viewManager.VIEW.SEE_STANDARDS_STUDENT);
				var oldEl = document.getElementById("challenge-submit");
				var newEl = oldEl.cloneNode(true);
				oldEl.parentNode.replaceChild(newEl, oldEl);
			});
		}



		document.getElementById("challenge-end-grade").innerText = "Grade: " + results.gradeOverall + "% " + results.gradeCumulativeStr;
		document.getElementById("challenge-end-time-taken").innerText = "Time: " + results.timeOverall + "s " + results.timeCumulativeStr;

		if(!this.altered) document.getElementById("std-internalisation").style.display = "none";

		document.getElementById("challenge-end-category-internalisation").innerHTML = results.standardInterName;
		document.getElementById("challenge-end-category-internalisation-score").innerHTML = results.standardInterScore;

	}

	stringifyAverageTime()
	{
		var timeInSeconds = this.model.averageTimeSeconds;
		var minutesInt = ~~(timeInSeconds/60);
		var secondsInt = (timeInSeconds%60);

		var timeStr = "";

		if (minutesInt < 10) {
			timeStr = "0"+minutesInt + ":";
		}
		else {
			timeStr = minutesInt + ":";
		}

		if (secondsInt < 10) {
			timeStr += "0"+secondsInt;
		}
		else {
			timeStr += secondsInt;
		}
		return timeStr;
	}

	setReviewData(filename)
	{
		var reviewTable = document.getElementById("challenge-data-table");
		var rowCount = reviewTable.rows.length;
		while (--rowCount) {
			reviewTable.deleteRow(rowCount);
		}

		var reviewDict = {};
		if (this.allFilesReview[filename]) {
			reviewDict = this.allFilesReview[filename];
		}

		else {
			this.allFilesReview[filename] = {};
			reviewDict = this.allFilesReview[filename];
		}

		// "sort Dict"
		var ids = Object.keys(reviewDict); // or loop over the object to get the array
		ids.sort(function(a,b){
			var aID = parseInt(a.split("#")[1]);
			var bID = parseInt(b.split("#")[1]);
			return (aID - bID);
		});

		for (var i = 0; i < ids.length; i++) { // now lets i
			var id = ids[i];


			// Add row to a table
			var row = reviewTable.insertRow(-1);

			row.id = id + "-row";
			var cell0 = row.insertCell(0);
			var cell1 = row.insertCell(1);
			var cell2 = row.insertCell(2);

			if (reviewDict[id].type === "token")
			{
				cell0.innerHTML = reviewDict[id].content;
			}

			else
			{
				cell0.innerHTML = "Whole Line " + reviewDict[id].content;
			}

			cell1.innerHTML = reviewDict[id].review_type.charAt(0).toUpperCase() + reviewDict[id].review_type.slice(1);
			cell2.innerHTML = reviewDict[id].review;

			var codeSpan = document.getElementById(id);
			codeSpan.classList.add("selected");
		}


		document.getElementById("challenge-done").innerText =  this.model.currentChallengeLink + "/" +  this.model.totalChallenges;

	}


	tweakLineNumbers(filename, pressable)
	{
		var controller = this;

		// fixes line numbers
		var lineNumSpans = document.getElementsByName("lineNumSpan");
    	for (var i = 0; i < lineNumSpans.length; i++ )
		{
			var codeElement = lineNumSpans[i];
			codeElement.id = "codeLineID#" + (i+1);

			codeElement.addEventListener("click", function ()
			{
				if (controller.allowSelection === true && controller.finishedChallenge === false)
				{
					//Check if it is already has a class "selected"
					if (!this.classList.contains("selected") && !controller.checkIssueQuantityLimit())
					{
						this.className += " reviewed";
						controller.addLineBit(this.id, filename);
						controller.allowSelection = false;
					}
				}
			});

		}
	}

	updateIssueCountLabel()
	{
		var totalIssuesLabel = document.getElementById("total-issues");
		var totalIssuesFound = Object.keys(this.issuesFound).length;
		var totalIssuesPresent = Object.keys(this.model.issues).length;

		totalIssuesLabel.innerHTML = totalIssuesFound + "/" + totalIssuesPresent;
	}

	checkIssueQuantityLimit()
	{
		var totalIssuesFound = Object.keys(this.issuesFound).length;
		var totalIssuesPresent = Object.keys(this.model.issues).length;
		return totalIssuesPresent === totalIssuesFound;
	}


	tweakCodeBlock(filename, pressable)
	{
		this.tweakLineNumbers(filename, pressable);
	}


	addLineBit(id, filename)
	{
		// Save it to review (for now.  Can be done after the review)
		var codeBit = {};
		codeBit.content = id.split("#")[1];
		codeBit.type = "line";

		this.openSidenavAndConstructIssue(id, filename, codeBit);
	}


	deleteLineBit(id, filename)
	{
		delete this.issuesFound[id];
		var rowToDelete = document.getElementById(id + "-row");
		rowToDelete.parentNode.removeChild(rowToDelete);
	}

	update()
	{

	}

	openSidenavAndConstructIssue(id, filename, codeBit)
	{
		var controller = this;
		this.codeBitReviewed = codeBit;
		this.codeElementIdReviewed = id;

        var sideModal = document.getElementById("challenge-code-side-modal");
        sideModal.style.width = "45%";

        // Make an X on a side view to close the side modal
        document.getElementById("challenge-code-side-modal-close").addEventListener("click", function () {
            sideModal.style.width = "0px";
            if (controller.codeElementIdReviewed !== "")
            {
				document.getElementById(id).classList.remove("reviewed");
				controller.allowSelection = true;
			}
        });
    }

	closeSidenavAndSaveTheReview(type, content)
	{
		var controller = this;

		// Close sidenav and return all in sidenav elements to its original state.
		var sideModal = document.getElementById("challenge-code-side-modal");
        sideModal.style.width = "0";

		if (this.categoryElemSelected !== "")
		{
			this.categoryElemSelected.classList.remove("standard-bit-selected");
			this.categoryElemSelected = "";
		}


		var codeBit = this.codeBitReviewed;
		var id = this.codeElementIdReviewed;

		document.getElementById(id).classList.remove("reviewed");
		document.getElementById(id).classList.add("selected");

		this.codeBitReviewed = "";
		this.codeElementIdReviewed = "";

		codeBit.review_type = type.charAt(0).toUpperCase() + type.slice(1);
		if (type === "issue")
		{
			codeBit.review = content.number;
			codeBit.standard = content;
		}

		else
		{
			codeBit.review = content;
		}


		this.issuesFound[id] = codeBit;

		var reviewTable = document.getElementById("challenge-data-table");
		var row = reviewTable.insertRow(-1);

		row.id = id + "-row";


		var cell0 = row.insertCell(0);
		var img = document.createElement("IMG");
		img.src = "resources/images/trash-button.png";
		img.id = "issue-delete-button--" + id;
		img.name = "issue-delete-button";
		img.style.width = "100%";
		img.addEventListener("mouseover", function()
		{
			this.style.filter = "invert(100%)";
		});
		img.addEventListener("mouseleave", function()
		{
			this.style.filter = "invert(0%)";
		});

		img.addEventListener("click", function()
		{
			var id = this.id.split('--')[1];
			controller.deleteLineBit(id);
			document.getElementById(id).classList.remove("selected");
		});
		cell0.appendChild(img);


		var cell1 = row.insertCell(1);
		var cell2 = row.insertCell(2);
		var cell3 = row.insertCell(3);


		if( codeBit.type === "line")
		{
			cell1.innerHTML =  codeBit.content;
		}

		cell2.innerHTML = "[" + content.category + "]<br>" + content.subCategory;

		cell3.innerHTML = "?";
		cell3.style.textAlign="center";
		cell3.id = "challenge-review-answer#" + codeBit.content  + "#" + content.number;

		this.updateIssueCountLabel();

		this.allowSelection = true;
	}

	startTimer()
	{
		var controller = this;
		this.timer = setInterval(function()
		{
			controller.seconds++;
			if(controller.seconds >= 60)
			{
				controller.minutes++;
				controller.seconds = 0;
			}
			document.getElementById("challenge-timer").innerText =
				(controller.minutes ? (controller.minutes > 9 ? controller.minutes : "0" + controller.minutes) : "00") +
				":" +
				(controller.seconds > 9 ? controller.seconds : "0" + controller.seconds);
		},1000)
	}

	stopTimer()
	{
		clearInterval(this.timer);
		var timeTaken = (this.minutes ? (this.minutes > 9 ? this.minutes : "0" + this.minutes) : "00") +
				":" +
				(this.seconds > 9 ? this.seconds : "0" + this.seconds);

		this.seconds = 0;
		this.minutes = 0;
		document.getElementById("challenge-timer").innerText = "00:00";

		return timeTaken;
	}


	alterView()
    {
        document.getElementById("challenge-done").style.display="none";
        document.getElementById("challenge-chain-done-progress").innerHTML = "";
        this.altered = true;

        for( var i = 0; i < this.model.totalChallenges; i++)
            app.utils.addChallengeProgressBar( i + 1);

    }
}
