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

	}

	setupSideModal()
	{
		var controller = this;
		if (this.setSideModal)
		{
            var standards = app.standards.selectStandards( app.assignments.getById(this.model.getReviewedSubmission().assignmentID).standardUsed);
            var categorySelectDiv = document.getElementById("code-review-category-select-div");

            for (var key in standards)
            {
                var categoryName = key;

                //create a span to insert into div
                var categorySpan = document.createElement("SPAN");
                categorySpan.id = "code-review-category#" + categoryName;
                categorySpan.innerHTML = categoryName;
                categorySpan.className = "code-review-select-category-span";

                var subCategoryDiv = document.createElement("div");
                subCategoryDiv.id = "code-review-select-subcategory-div#" + categoryName;


				categorySelectDiv.appendChild(categorySpan);
                categorySelectDiv.appendChild(subCategoryDiv);

                categorySpan.addEventListener("click", function ()
				{
					var localSubCategoryDiv = document.getElementById("code-review-select-subcategory-div#" + this.id.split("#")[1]);
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

						var getStdByNumber = function(subCategories, i)
                        {
                            for (var j = 0; j < subCategories.length; j++)
                            {
                                if (subCategories[j].number === i) return subCategories[j];
                            }
                        };

						for (var i = 0; i < subcategories.length; i++)
						{
						    var subcategory = getStdByNumber(subcategories, i);

							var spanContainer = document.createElement("SPAN");

							var subcategorySpan = document.createElement("SPAN");
							subcategorySpan.id = "code-review-category#" + subcategory.category +"#" +i;
							subcategorySpan.className = "code-review-select-subcategory-span";

							app.utils.insertTooltip(subcategorySpan, subcategory.description);

							var img = document.createElement("IMG");
							img.src = "resources/images/info.png";
							img.id = "code-review-select-subcategory-tooltip#" + subcategory.category + "#" + i;
							img.className = "picture-button";
							img.style.float = "right";

							var label = document.createElement("LABEL");
							label.id = "code-review-category#" + subcategory.category +"#" + i + "#label";
							label.innerHTML = subcategory.subCategory;

                            img.style.filter = "invert(0%)";
							img.addEventListener("click",function ()
							{
							    if (this.style.filter === "invert(0%)")
							    {
							        app.annalist.saveForLogs("tooltip_click", {});

                                    this.style.filter = "invert(100%)";
							    	var category = this.id.split("#")[1];
							    	var idNum = this.id.split("#")[2];

							    	var subCatSpan = document.getElementById("code-review-category#" + category + "#" + idNum);
							    	var tootlipElem = subCatSpan.getElementsByClassName("tooltiptext")[0];

							    	tootlipElem.style.visibility = "visible";
							    	tootlipElem.style.opacity= "1";
                                }

                                else
                                {
                                    this.style.filter = "invert(0%)";
                                    var category = this.id.split("#")[1];
                                    var idNum = this.id.split("#")[2];

                                    var subCatSpan = document.getElementById("code-review-category#" + category + "#" + idNum);

                                    var tootlipElem = subCatSpan.getElementsByClassName("tooltiptext")[0];
                                    tootlipElem.style.visibility = "hidden";
                                    tootlipElem.style.opacity= "0";
                                }
							});

							subcategorySpan.addEventListener("click", function ()
							{
								var lCategory =  this.id.split("#")[1];
								var lSubCategory =  this.id.split("#")[2];

								var resultStandard = app.standards.getStandard(lCategory, lSubCategory, controller.fileOpened.split(".")[1]);

								controller.closeSidenavAndSaveTheReview("issue", resultStandard);
								localSubCategoryDiv.innerHTML = "";
							});




							subcategorySpan.appendChild(label);
							spanContainer.appendChild(subcategorySpan);
							spanContainer.appendChild(img);

							localSubCategoryDiv.appendChild(spanContainer);
						}
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
                    this.parsedCodeHTMLs[name] = Prism.highlight(submissionFiles[name], Prism.languages.js);
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

                var currentFeedbacks = [];

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
		var controller = this;
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
				controller.model.submitReview(controller.allFilesReview, controller.newReview);

				controller.parsedCodeHTMLs = {};
				controller.allFilesReview = {};

				if (app.user.role === "teacher")
				{
					app.viewManager.goToView(app.viewManager.VIEW.ASSIGNMENTS_TEACHER);
				}
				else
				{
					app.viewManager.goToView(app.viewManager.VIEW.ASSIGNMENTS_STUDENT);
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
					if (controller.allowSelection == true)
					{
						var lineNum = this.id.split("#")[1];

						//Check if it is already has a class "selected"
						if (!this.classList.contains("selected")) {
							this.className += " reviewed";
							controller.addLineBit(this.id, filename);
							controller.allowSelection = false;
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

				if (content !== ""){
					var span = document.createElement("SPAN");
					span.className = "token";
					span.innerText = "" + content + "";
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
					if (controller.allowSelection == true)
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
		var controller = this;
		// Close sidenav and return all in sidenav elements to its original state.
		var sideModal = document.getElementById("code-review-side-modal");
        sideModal.style.width = "0";

		//document.getElementById("code-review-sidenav-issue-category").style.display = "none";

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
		var cell3 = row.insertCell(3);


		var img = document.createElement("IMG");
		img.src = "resources/images/trash-button.png";
		img.id = "issue-delete-button--" + id;
		img.style.width = "50%";
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

			document.getElementById(id).classList.remove("selected");

			if (id.includes("reviewLine") )
			{
				controller.deleteLineBit(id);
			}
			else
			{
				controller.deleteCodeBit((id));
			}

		});
		cell0.appendChild(img);


		if( codeBit.type === "line")
		{
			cell1.innerHTML = "Whole line " + codeBit.content;
		}
		else
		{
			cell1.innerHTML = codeBit.content;
		}

		cell2.innerHTML = codeBit.review_type;
		cell3.innerHTML = codeBit.review;



		this.allowSelection = true;
	}








}
