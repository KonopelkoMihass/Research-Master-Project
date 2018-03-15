class CodeViewController
{
	constructor(model)
	{
		this.model = model;
		this.setup();
		this.parsedCodeHTMLs = {};
		this.allFilesReview = {};
		this.newReview = true;

		this.setSideModal = true;

		this.categoryElemSelected = "";

		this.codeBitReviewed = "";
		this.codeElementIdReviewed = "";
		this.fileOpened = "";

		this.fileButtonHighlighted = "";
		this.allowSelection = true;

		this.fileButtonPointer = "";
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
            // The choice buttons
            document.getElementById("code-review-sidenav-choice-left").addEventListener("click", function () {
                document.getElementById("code-review-sidenav-comment").style.display = "block";
                document.getElementById("code-review-sidenav-issue-category").style.display = "none";
            });

            document.getElementById("code-review-sidenav-choice-right").addEventListener("click", function () {
                document.getElementById("code-review-sidenav-issue-category").style.display = "block";
                document.getElementById("code-review-sidenav-comment").style.display = "none";
            });


			document.getElementById("submit-comment").addEventListener("click", function () {
				var comment = document.getElementById("code-review-sidenav-comment-textbox").value;
				document.getElementById("code-review-sidenav-comment-textbox").value = "";
				that.closeSidenavAndSaveTheReview("comment", comment)
            });


            var standards = app.standards.standards;

            var categorySelectDiv = document.getElementById("code-review-category-select-div");
            var subCategorySelectDiv = document.getElementById("code-review-subcategory-select-div");

            for (var key in standards) {
                var categoryName = key;

                //create a span to insert into div
                var categorySpan = document.createElement("SPAN");
                categorySpan.id = "code-review-category#" + categoryName;
                categorySpan.innerHTML = categoryName;
                categorySpan.className = "code-review-select-category-span";

                categorySelectDiv.appendChild(categorySpan);

                categorySpan.addEventListener("click", function ()
				{
					// clean sub category
					subCategorySelectDiv.innerHTML = "";

					//show it
					document.getElementById("code-review-sidenav-issue-subcategory").style.display = "block";

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
						subcategorySpan.id = "code-review-category#" + subcategories[i].category +"#" +i;


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
                })


            }


            this.setSideModal = false;
        }
	}


	cleanUp()
	{
		this.parsedCodeHTMLs = {};
		this.allFilesReview = {};
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


                var currentFeedbacks = []; //feedbacks[iteration];
				for(var j = 0; j < feedbacks.length; j++)
				{
					if (feedbacks[j].iteration_submitted === this.model.submissions[i].iteration)
					{
						currentFeedbacks.push(feedbacks[j]);
					}
				}

                for (var j = 0; j < currentFeedbacks.length; j++)
                {
                	if (parseInt(currentFeedbacks[j].reviewer_id) === this.model.reviewerIDToCodeView)
                	{
                		this.newReview = false;
                		this.allFilesReview = currentFeedbacks[j].review;
                		break;
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

		var openFirstFile = true;

		for (var name in this.parsedCodeHTMLs)
		{
			var button = document.createElement("BUTTON");
			button.innerHTML = name;
			button.id = "file-select-button#"+name;
			fileSelectDiv.appendChild(button);

			button.addEventListener("click", function ( )
            {
            	var filename = this.innerHTML;
            	controller.fileOpened = filename;

				 // Now we insert it into a <code> area
				document.getElementById("code-review").innerHTML = controller.parsedCodeHTMLs[filename];

				// Needed to restore line numbers
    			Prism.highlightAllUnder(document.getElementById("precode-area"));

				controller.tweakCodeBlock(filename, allowReview);

				// reapply selections and review data.
				controller.setReviewData(filename);


				if (controller.fileButtonHighlighted !== "")
				{
					controller.fileButtonHighlighted.classList.remove("file-selected");
				}

				this.classList.add("file-selected");

				controller.fileButtonHighlighted = this;
			});

			if (openFirstFile){
				openFirstFile = false;
				this.fileButtonPointer = button;
			}
		}
	}

	allowReview(allow)
	{
		var that = this;
		if (!allow)
		{
			document.getElementById("submit-review-div").style.display = "none";
		}
		else
		{
			document.getElementById("submit-review-div").style.display = "block";


			var removeEventListener = function ()
			{
				var oldEl = document.getElementById("submit-review");
				var newEl = oldEl.cloneNode(true);
				oldEl.parentNode.replaceChild(newEl, oldEl);
            };





			document.getElementById("submit-review").addEventListener("click", function ()
			{
				that.model.submitReview(that.allFilesReview, that.newReview);

				that.parsedCodeHTMLs = {};
				that.allFilesReview = {};

				if (app.user.role === "teacher")
				{
					app.viewManager.goToView(app.viewManager.VIEW.ASSIGNMENTS_TEACHER);
				}
				else
				{
					app.viewManager.goToView(app.viewManager.VIEW.PROFILE);
				}

				removeEventListener();
			});
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
			codeElement.id = "reviewLineID#" + (i+1);

			if (pressable)
			{
				codeElement.addEventListener("click", function ()
				{
					if (controller.allowSelection)
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
	}

	tweakCodeBlock(filename, pressable)
	{
		var controller = this;

		this.tweakLineNumbers(filename, pressable);
		this.tweakTokens(filename, pressable);
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

		this.openSidenavAndConstructIssue(id,filename, codeBit);

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


		this.openSidenavAndConstructIssue(id, filename, codeBit);
	}



	deleteCodeBit(id, filename)
	{
		var reviewDict = this.allFilesReview[filename];
		delete reviewDict[id];
		var rowToDelete = document.getElementById(id + "-row");
		rowToDelete.parentNode.removeChild(rowToDelete);
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

	openSidenavAndConstructIssue(id, filename, codeBit)
	{
		var that = this;
		this.codeBitReviewed = codeBit;
		this.codeElementIdReviewed = id;

        var sideModal = document.getElementById("code-review-side-modal");
        sideModal.style.width = "45%";

        // Make an X on a side view to close the side modal
        document.getElementById("code-review-side-modal-close").addEventListener("click", function () {
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
		var sideModal = document.getElementById("code-review-side-modal");
        sideModal.style.width = "0";




		document.getElementById("code-review-sidenav-issue-category").style.display = "none";

		document.getElementById("code-review-subcategory-select-div").innerHTML = "";
		document.getElementById("code-review-sidenav-issue-subcategory").style.display = "none";


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


		var reviewDict = this.allFilesReview[this.fileOpened];
		reviewDict[id] = codeBit;

		var reviewTable = document.getElementById("review-data-table");
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








}
