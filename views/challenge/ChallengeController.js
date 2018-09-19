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
	}

	setup()
	{
		console.log(this.model);
	}

	setupSideModal()
	{
		var controller = this;
		if (this.setSideModal)
		{
            var standards =  app.standards.selectStandards(this.model.standard);
            var categorySelectDiv = document.getElementById("challenge-code-category-select-div");

            for (var key in standards) {
                var categoryName = key;

                //create a span to insert into div
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

						for (var i = 0; i < subcategories.length; i++)
						{
							var spanContainer = document.createElement("SPAN");

							var subcategorySpan = document.createElement("SPAN");
							subcategorySpan.id = "challenge-code-category#" + subcategories[i].category +"#" + i;
							subcategorySpan.className = "code-review-select-subcategory-span";

							app.utils.insertTooltip(subcategorySpan, subcategories[i].description);

							var img = document.createElement("IMG");
							img.src = "resources/images/info.png";
							img.id = "challenge-select-subcategory-tooltip#" + subcategories[i].category + "#" + i;
							img.className = "picture-button";
							img.style.float = "right";

							var label = document.createElement("LABEL");
							label.id = "challenge-code-category#" + subcategories[i].category +"#" + i + "#label";
							label.innerHTML = subcategories[i].number;

							img.addEventListener("mouseover",function ()
							{
								this.style.filter = "invert(100%)";
								var category = this.id.split("#")[1];
								var idNum = this.id.split("#")[2];

								var subCatSpan = document.getElementById("challenge-code-category#" + category + "#" + idNum);
								var tootlipElem = subCatSpan.getElementsByClassName("tooltiptext")[0];

								tootlipElem.style.visibility = "visible";
								tootlipElem.style.opacity= "1";

							});

							img.addEventListener("mouseleave",function ()
							{
								this.style.filter = "invert(0%)";
								var category = this.id.split("#")[1];
								var idNum = this.id.split("#")[2];
								var subCatSpan = document.getElementById("challenge-code-category#" + category + "#" + idNum);
								var tootlipElem = subCatSpan.getElementsByClassName("tooltiptext")[0];
								tootlipElem.style.visibility = "hidden";
								tootlipElem.style.opacity= "0";
							});


							subcategorySpan.addEventListener("click", function ()
							{
								var lCategory =  this.id.split("#")[1];
								var lSubCategory =  this.id.split("#")[2];
								var resultStandard = app.standards.standards[lCategory][lSubCategory];

								controller.closeSidenavAndSaveTheReview("issue", resultStandard);
								subCategoryDiv.innerHTML = "";
							});



							subcategorySpan.addEventListener("mouseover",function ()
							{
								var cat = this.id.split("#")[1];
								var subCategoryIndex = this.id.split("#")[2];
								var standard = standards[cat][subCategoryIndex];

								document.getElementById("challenge-code-category#" + cat +"#" + subCategoryIndex + "#label").innerText = standard.subCategory;
							});

							subcategorySpan.addEventListener("mouseleave",function ()
							{
								var cat = this.id.split("#")[1];
								var subCategoryIndex = this.id.split("#")[2];
								var standard = standards[cat][subCategoryIndex];

								document.getElementById("challenge-code-category#" + cat +"#" + subCategoryIndex + "#label").innerText = standard.number;
							});


							subcategorySpan.appendChild(label);
							spanContainer.appendChild(subcategorySpan);
							spanContainer.appendChild(img);

							localSubCategoryDiv.appendChild(spanContainer);

						}
					}
                });
            }

            this.setSideModal = false;
        }
	}

	cleanUp()
	{
		this.stopTimer();
		this.seconds = 0;
		this.minutes = 0;
		this.issuesFound = {};

		this.parsedCodeHTMLs = {};
		this.allFilesReview = {};
		document.getElementById("challenge-file-select").innerHTML = "";
		document.getElementById("challenge-code-review").innerHTML = "";
		document.getElementById("challenge-code-box").classList.remove("box");
		document.getElementById("challenge-code-box").classList.add("box-left");
		document.getElementById("challenge-submit-div").style.display = "block";
	}

	prepareCodeHTMLs() {
        // Get files and parse them into a highlighted HTML.  Then put them in a parsedCodeHTMLs.
		this.parsedCodeHTMLs["challenge"] = Prism.highlight(this.model.code, app.utils.derivePrismLanguage(this.model.language));

		// Now we insert it into a <code> area
		document.getElementById("challenge-code-review").innerHTML = this.parsedCodeHTMLs["challenge"];

		// Needed to restore line numbers
		Prism.highlightAllUnder(document.getElementById("challenge-precode-area"));
		this.fileOpened = "challenge";
		this.tweakCodeBlock("challenge", true);
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
			controller.saveChallengeResults();

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


			controller.stopTimer();
		});
	}

	saveChallengeResults()
	{
		var data = {};

		data.time = 60 * this.minutes + this.seconds;
		data.grade = this.model.calculateScore(this.issuesFound);

		this.model.saveResults(data);
		this.model.issues = {};
	}


	showChallengeEndScreen()
	{
		this.parsedCodeHTMLs = {};

		this.model.changeStdInternalisation();
		//this.model.submitChallengeResults();




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
				app.viewManager.goToView(app.viewManager.VIEW.ASSIGNMENTS_STUDENT);
				var oldEl = document.getElementById("challenge-submit");
				var newEl = oldEl.cloneNode(true);
				oldEl.parentNode.replaceChild(newEl, oldEl);



			});
		}

		document.getElementById("challenge-end-grade").innerText = "Grade: " + results.gradeOverall + "% " + results.gradeCumulativeStr;
		document.getElementById("challenge-end-time-taken").innerText = "Time: " + results.timeOverall + "s " + results.timeCumulativeStr;
		document.getElementById("challenge-end-category-internalisation").innerHTML = results.standardInterScore;
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

				var lineNum = this.id.split("#")[1];

				//Check if it is already has a class "selected"
				if (!this.classList.contains("selected")) {
					this.className += " reviewed";
					controller.addLineBit(this.id, filename);
					controller.allowSelection = false;
				}

				else {
					this.classList.remove("selected");
					controller.deleteLineBit(this.id, filename);
				}

			});

		}
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
		var that = this;
		this.codeBitReviewed = codeBit;
		this.codeElementIdReviewed = id;

        var sideModal = document.getElementById("challenge-code-side-modal");
        sideModal.style.width = "45%";

        // Make an X on a side view to close the side modal
        document.getElementById("challenge-code-side-modal-close").addEventListener("click", function () {
            sideModal.style.width = "0px";
            if (that.codeElementIdReviewed !== "")
            {
				document.getElementById(id).classList.remove("reviewed");
				that.allowSelection = true;
			}
        });
    }


	closeSidenavAndSaveTheReview(type, content)
	{
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
		var cell1 = row.insertCell(1);

		if( codeBit.type === "line")
		{
			cell0.innerHTML = "Line " + codeBit.content;
		}
		else
		{
			cell0.innerHTML = codeBit.content;
		}

		cell1.innerHTML = codeBit.review;

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
}
