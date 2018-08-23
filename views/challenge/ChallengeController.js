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

		this.issues = {};

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
		var that = this;
		if (this.setSideModal)
		{
            var standards =  app.standards.selectStandards(this.model.standard);

            var categorySelectDiv = document.getElementById("challenge-code-category-select-div");
            var subCategorySelectDiv = document.getElementById("challenge-code-subcategory-select-div");

            for (var key in standards) {
                var categoryName = key;

                //create a span to insert into div
                var categorySpan = document.createElement("SPAN");
                categorySpan.id = "challenge-code-standard-category#" + categoryName;
                categorySpan.innerHTML = categoryName;
                categorySpan.className = "code-review-select-category-span";

                categorySelectDiv.appendChild(categorySpan);

                categorySpan.addEventListener("click", function ()
				{
					// clean sub category
					subCategorySelectDiv.innerHTML = "";

					//show it
					document.getElementById("challenge-code-sidenav-issue-subcategory").style.display = "block";

					if (that.categoryElemSelected !== "")
					{
						that.categoryElemSelected.classList.remove("standard-bit-selected");
					}
					that.categoryElemSelected = this;
					that.categoryElemSelected.classList.add("standard-bit-selected");



                	var cat = this.id.split("#")[1];
					var subcategories = standards[cat];
					for (var i = 0; i < subcategories.length; i++)
					{

						var subcategorySpan = document.createElement("SPAN");
						subcategorySpan.id = "challenge-code-category#" + subcategories[i].category +"#" +i;
						subcategorySpan.innerHTML = subcategories[i].subCategory;
						subcategorySpan.className = "code-review-select-subcategory-span";

						app.uiFactory.insertTooltip(subcategorySpan, subcategories[i].description);

						subcategorySpan.addEventListener("click", function ()
						{
							var lCategory =  this.id.split("#")[1];
							var lSubCategory =  this.id.split("#")[2];

							var resultStandard = app.standards.standards[lCategory][lSubCategory];

							that.closeSidenavAndSaveTheReview("issue", resultStandard)
						});


						subCategorySelectDiv.appendChild(subcategorySpan)
					}
                });
            }

            this.setSideModal = false;
        }
	}

	cleanUp()
	{
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
		this.parsedCodeHTMLs["challenge"] = Prism.highlight(this.model.code, app.uiFactory.derivePrismLanguage(this.model.language));

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

		var removeEventListener = function ()
		{
			var oldEl = document.getElementById("challenge-submit");
			var newEl = oldEl.cloneNode(true);
			oldEl.parentNode.replaceChild(newEl, oldEl);
		};


		document.getElementById("challenge-submit").addEventListener("click", function ()
		{

			controller.parsedCodeHTMLs = {};
			var time = controller.stopTimer();
			var grade = controller.model.calculateScore(controller.issues);

			//WORK MORE ON MODAL.

			var modalBody = app.modalContentManager.getModalContent("challenge-end");
			var modalData = app.uiFactory.createModal("challenge-end", "Challenge Score", modalBody, false);
			document.body.appendChild(modalData.modal);
			modalData.modal.style.display = "block";

			var closes = modalData.closes;
			for (var i = 0; i < closes.length; i++)
			{
				closes[i].addEventListener("click", function ()
				{
					app.viewManager.goToView(app.viewManager.VIEW.ASSIGNMENTS_STUDENT);
					removeEventListener();
				});
			}

			document.getElementById("challenge-end-grade").innerText = "Grade: "+grade+"%";
			document.getElementById("challenge-end-time-taken").innerText = time;
			document.getElementById("challenge-end-average-time").innerText = controller.stringifyAverageTime();

			controller.saveChallengeResults(grade);
			controller.issues = {};

		});
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

	tweakTokens(filename, pressable)
	{
		var controller = this;

		// Tweak tokens
		var tokens = document.getElementById("challenge-code-review").childNodes;
		for (var i = 0; i < tokens.length; i++ )
		{
			var token = tokens[i];

			// Line number span is also in there.  So to not affect it - we will check for a specific class name and skip it.
			if (token.className === "line-numbers-rows")
			{
				continue;
			}

			// PrismJS puts unidentifiable things as pure text.  These text are often the variables,
			// so I decided to turn them into span here.
			if (token.nodeName === "#text")
			{
				var content = token.textContent;

				if (content !== ""){
					var span = document.createElement("SPAN");
					span.className = "token";
					span.innerText = "" + content + "";
					document.getElementById("challenge-code-review").replaceChild(span, token);
					token = span;
				}
			}

			// Then I add ID for each span and a click event.
			token.id = "reviewTokenID#" + i ;

			token.addEventListener("click", function()
			{
				if (controller.allowSelection)
				{
					var wordNum = this.id.split("#")[1];
					var content = this.textContent;

					//Check if does not have a class "selected"
					if ( !this.classList.contains("selected"))
					{
						this.className += " reviewed";
						controller.addCodeBit(this.id, content, filename);
						controller.allowSelection = false;
					}

					else
					{
						this.classList.remove("selected");
						controller.deleteCodeBit(this.id, filename);
					}
				}
			});

		}
	}

	tweakCodeBlock(filename, pressable)
	{
		var controller = this;

		this.tweakLineNumbers(filename, pressable);
		this.tweakTokens(filename, pressable);
	}

	addCodeBit(id, content, filename)
	{
		// Save it to review (for now.  Can be done after the review)
		var codeBit = {};
		codeBit.content = content;
		codeBit.type = "token";

		this.openSidenavAndConstructIssue(id,filename, codeBit);

	}

	addLineBit(id, filename)
	{
		// Save it to review (for now.  Can be done after the review)
		var codeBit = {};
		codeBit.content = id.split("#")[1];
		codeBit.type = "line";

		this.openSidenavAndConstructIssue(id, filename, codeBit);
	}

	deleteCodeBit(id, filename)
	{
		delete this.issues[id];
		var rowToDelete = document.getElementById(id + "-row");
		rowToDelete.parentNode.removeChild(rowToDelete);
	}



	deleteLineBit(id, filename)
	{
		delete this.issues[id];
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

		document.getElementById("challenge-code-subcategory-select-div").innerHTML = "";
		document.getElementById("challenge-code-sidenav-issue-subcategory").style.display = "none";


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
			codeBit.review = content.category + "->" + content.subCategory;
		}

		else
		{
			codeBit.review = content;
		}


		this.issues[id] = codeBit;

		var reviewTable = document.getElementById("challenge-data-table");
		var row = reviewTable.insertRow(-1);

		row.id = id + "-row";

		var cell0 = row.insertCell(0);
		var cell1 = row.insertCell(1);
		var cell2 = row.insertCell(2);


		if( codeBit.type === "line")
		{
			cell0.innerHTML = "Whole line " + codeBit.content;
		}
		else
		{
			cell0.innerHTML = codeBit.content;
		}

		cell1.innerHTML = codeBit.review_type;
		cell2.innerHTML = codeBit.review;

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

	saveChallengeResults(grade)
	{
		// WORK FROM HERE.
	}
}
