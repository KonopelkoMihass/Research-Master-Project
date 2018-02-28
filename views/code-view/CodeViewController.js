class CodeViewController
{
	constructor(model)
	{
		this.model = model;
		this.setup();
		this.parsedCodeHTMLs = {};
		this.allFilesReview = {};

	}

	setup()
	{
		var that = this;
		console.log(this.model);
	}

	cleanUp()
	{
		this.parsedCodeHTMLs = {};
		document.getElementById("file-select").innerHTML = "";
		document.getElementById("code-review").innerHTML = "";

		document.getElementById("code-box").classList.remove("box");
		document.getElementById("code-box").classList.add("box-left");
		document.getElementById("comment-box").style.display = "block";
		document.getElementById("submit-review-div").style.display = "block";
	}

	// Hide Review/Comments div and reposition code view.
	setViewAsClear()
	{
		document.getElementById("code-box").classList.remove("box-left");
		document.getElementById("code-box").classList.add("box");
		document.getElementById("comment-box").style.display = "none";
	}



	prepareCodeHTMLs()
	{
        // Get files and parse them into a highlighted HTML.  Then put them in a parsedCodeHTMLs.
        for (var i = 0; i < this.model.submissions.length; i++) {
            if (this.model.submissions[i].id === this.model.submissionIDToCodeView) {
                var submissionFiles = this.model.submissions[i].submissionData;
                for (var name in submissionFiles) {
                    this.parsedCodeHTMLs[name] = Prism.highlight(submissionFiles[name], Prism.languages.cpp);
                }
            }
        }
    }

    retrieveAnyPreviousReviewData()
	{
		for (var i = 0; i < this.model.submissions.length; i++) {
            if (this.model.submissions[i].id === this.model.submissionIDToCodeView) {
                var feedbacks = this.model.submissions[i].feedbacks;
                var iteration = this.model.submissions[i].iteration;
                var feedback = feedbacks[iteration-1];


                for (var userID in feedback) {
                	if (parseInt(userID) === this.model.reviewerIDToCodeView)
                	{
                		this.allFilesReview = feedback[userID].review;

					}
                }
            }
        }

	}



    setupFileSelector(allowReview)
	{
		var controller = this;

		//Add file button selector
		var fileSelectDiv = document.getElementById("file-select");
		for (var name in this.parsedCodeHTMLs)
		{
			var button = document.createElement("BUTTON");
			button.innerHTML = name;
			button.id = "file-select-button#"+name;
			fileSelectDiv.appendChild(button);

			button.addEventListener("click", function ( )
            {
            	var filename = this.innerHTML;

				 // Now we insert it into a <code> area
				document.getElementById("code-review").innerHTML = controller.parsedCodeHTMLs[filename];

				// Needed to restore line numbers
    			Prism.highlightAllUnder(document.getElementById("precode-area"));

				controller.tweakCodeBlock(filename, allowReview);

				// reapply selections and review data.
				controller.setReviewData(filename);
			});
		}

		if (!allowReview)
		{
			document.getElementById("submit-review-div").style.display = "none";
		}
	}



	setReviewData(filename)
	{
		var reviewTable = document.getElementById("review-data-table");
		var rowCount = reviewTable.rows.length;
		while (--rowCount) {
			reviewTable.deleteRow(rowCount);
		}

		var reviewDict = {};
		if (this.allFilesReview[filename])
		{
			reviewDict = this.allFilesReview[filename];
		}

		else
		{
			this.allFilesReview[filename] = {};
			reviewDict = this.allFilesReview[filename];
		}

		for (var id in reviewDict)
		{
			// Add row to a table
			var row = reviewTable.insertRow(-1);

			row.id = id + "-row";
			var cell0 = row.insertCell(0);
			var cell1 = row.insertCell(1);

			if (reviewDict[id].type === "token")
			{
				cell0.innerHTML = reviewDict[id].content;
			}

			else
			{
				cell0.innerHTML = "Whole Line " + reviewDict[id].content;
			}

			cell1.innerHTML = reviewDict[id].review;

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
			codeElement.id = "reviewLineID#" + (i+1);

			if (pressable)
			{
				codeElement.addEventListener("click", function ()
				{
					var lineNum = this.id.split("#")[1];

					//Check if it is already has a class "selected"
					if (!this.classList.contains("selected")) {
						this.className += " selected";
						controller.addLineBit(this.id, filename);
					}

					else {
						this.classList.remove("selected");
						controller.deleteLineBit(this.id, filename);
					}
				});
			}
		}
	}

	tweakTokens(filename, pressable)
	{
		var controller = this;

		// Tweak tokens
		var tokens = document.getElementById("code-review").childNodes;
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
				content = content.replace(/\s/g, '');

				if (content !== ""){
					var span = document.createElement("SPAN");
					span.className = "token";
					span.innerText = " " + content + " ";
					document.getElementById("code-review").replaceChild(span, token);
					token = span;
				}
			}

			// Then I add ID for each span and a click event.
			token.id = "reviewTokenID#" + i ;

			if(pressable)
			{
				token.addEventListener("click", function()
				{
					var wordNum = this.id.split("#")[1];
					var content = this.textContent;

					//Check if does not have a class "selected"
					if ( !this.classList.contains("selected"))
					{
						this.className += " selected";
						controller.addCodeBit(this.id, content, filename);
					}

					else
					{
						this.classList.remove("selected");
						controller.deleteCodeBit(this.id, filename);
					}

				});
			}
		}
	}

	tweakCodeBlock(filename, pressable)
	{
		var controller = this;

		this.tweakLineNumbers(filename, pressable);
		this.tweakTokens(filename, pressable);

		if (pressable){
			document.getElementById("submit-review").addEventListener("click", function ()
			{
				controller.model.submitReview(controller.allFilesReview);

				controller.parsedCodeHTMLs = {};
				controller.allFilesReview = {};

				if (app.user.role === "teacher")
				{
					app.viewManager.goToView(app.viewManager.VIEW.ASSIGNMENTS_TEACHER);
				}
				else
				{
					app.viewManager.goToView(app.viewManager.VIEW.PROFILE);
				}
			});
		}

	}

	addCodeBit(id, content, filename)
	{
		var reviewDict = {};
		if (this.allFilesReview[filename])
		{
			reviewDict = this.allFilesReview[filename];
		}

		else
		{
			this.allFilesReview[filename] = {};
			reviewDict = this.allFilesReview[filename];
		}

		// Save it to review (for now.  Can be done after the review)
		var codeBit = {};
		codeBit.content = content;
		codeBit.type = "token";
		codeBit.review = "There we can have review stuff needed";

		reviewDict[id] = codeBit;

		var reviewTable = document.getElementById("review-data-table");
		var row = reviewTable.insertRow(-1);

		row.id = id + "-row";
		var cell0 = row.insertCell(0);
		var cell1 = row.insertCell(1);
		cell0.innerHTML = content;
		cell1.innerHTML = "There we can have review stuff needed";
	}



	deleteCodeBit(id, filename)
	{
		var reviewDict = this.allFilesReview[filename];
		delete reviewDict[id];
		var rowToDelete = document.getElementById(id + "-row");
		rowToDelete.parentNode.removeChild(rowToDelete);
	}


	addLineBit(id, filename)
	{
		var reviewDict = {};
		if (this.allFilesReview[filename])
		{
			reviewDict = this.allFilesReview[filename];
		}

		else
		{
			this.allFilesReview[filename] = {};
			reviewDict = this.allFilesReview[filename];
		}


		// Save it to review (for now.  Can be done after the review)
		var codeBit = {};
		codeBit.content = id.split("#")[1];
		codeBit.type = "line";
		codeBit.review = "There we can have review stuff needed";
		reviewDict[id] = codeBit;

		var reviewTable = document.getElementById("review-data-table");
		var row = reviewTable.insertRow(-1);

		row.id = id + "-row";
		var cell0 = row.insertCell(0);
		var cell1 = row.insertCell(1);
		cell0.innerHTML = "Whole line " + codeBit.content;
		cell1.innerHTML = "There we can have review stuff needed";
	}


	deleteLineBit(id, filename)
	{
		var reviewDict = this.allFilesReview[filename];
		delete reviewDict[id];
		var rowToDelete = document.getElementById(id + "-row");
		rowToDelete.parentNode.removeChild(rowToDelete);
	}



	update()
	{

	}
}
