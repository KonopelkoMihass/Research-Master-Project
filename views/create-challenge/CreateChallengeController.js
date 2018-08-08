class CreateChallengeController
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
	}

	setup()
	{
		console.log(this.model);
	}


	createSubmitChallengeFileModal()
	{
		var controller = this;

		var modalBody = app.modalContentManager.getModalContent("submit-challenge-file");
		var modalData = app.uiFactory.createModal("create-challenge", "Submit Challenge File", modalBody, true);
		document.body.appendChild(modalData.modal);
		modalData.modal.style.display = "block";

		var closes = modalData.closes;
		for (var i = 0; i < closes.length; i++) {
			closes[i].addEventListener("click", function () {
				app.viewManager.goToView(app.viewManager.VIEW.SEE_SUBMISSIONS_TEACHER);
			});

		}


		// Adds logic to the filedrop area.
		this.prepareFiledropArea();

		var submitBtn = modalData.submit;
		submitBtn.addEventListener("click", function () {
			if (controller.model.code === "")
			{
				alert("You did not submit a file");
			}
			else
			{
				controller.cleanUp();
				controller.prepareCodeHTMLs();
				controller.setupSideModal();
				controller.allowReview();
				controller.setReviewData();

				var parentNode = modalData.modal.parentNode;
				parentNode.removeChild(modalData.modal);
			}
        });
	}

	prepareFiledropArea()
	{
		var controller = this;

		var fileselect = document.getElementById("challenge-file-select");
		var	filedrag = document.getElementById("challenge-file-drag");
		var submitbutton = document.getElementById("challenge-file-submit-button");


		var fileDragHover = function(e) {
			e.stopPropagation();
			e.preventDefault();
			e.target.className = (e.type === "dragover" ? "hover" : "");
		};


		var fileSelectHandler = function (e) {
			fileDragHover(e);
			var files = e.target.files || e.dataTransfer.files;
			for (var i = 0, f; f = files[i]; i++)
			{
				parseFile(f);
			}
		};

		// output file information
		var parseFile = function parseFile(file)
		{
			var fileFormat = file.name.split(".")[1];
			if (fileFormat === "js")
			{
				var reader = new FileReader();
				reader.onload = function(e)
				{
					controller.uploadFile(file.name, reader.result);
				};
				reader.readAsText(file);
				document.getElementById("challenge-file-messages").innerHTML = ""
			}
			else {
				document.getElementById("challenge-file-messages").innerHTML = "Failed to load file " + file.name + ".<br>"
			}
		};


		// file select
		fileselect.addEventListener("change", fileSelectHandler, false);

		var xhr = new XMLHttpRequest();
		if (xhr.upload)
		{
			// file drop
			filedrag.addEventListener("dragover", fileDragHover, false);
			filedrag.addEventListener("dragleave", fileDragHover, false);
			filedrag.addEventListener("drop", fileSelectHandler, false);
			filedrag.style.display = "block";

			// remove submit button
			submitbutton.style.display = "none";
		}
	}

	uploadFile(name, content){
		this.fileNameParsed = name;
		this.model.addCodeContent(content);
		this.updateModal();
	}

	deleteFile(name){
		this.fileNameParsed = "";
		this.model.removeCodeContent();
		this.updateModal();

	}

	updateModal(){
		var controller = this;

		var filesLoadedDiv = document.getElementById("challenge-file-loaded");
		filesLoadedDiv.innerHTML = "";

		if (this.fileNameParsed !== "")
		{
			var fileDiv = document.createElement("div");
			fileDiv.className = "file-uploaded-box";


			var deleteSpan = document.createElement("SPAN");
			deleteSpan.innerHTML = "&#10006;  ";
			deleteSpan.id =  "delete-file#" + this.fileNameParsed;
			deleteSpan.addEventListener("click", function()
			{
				controller.deleteFile(this.id.split("#")[1]);
			});

			fileDiv.appendChild(deleteSpan);

			var nameSpan = document.createElement("SPAN");
			nameSpan.innerHTML = this.fileNameParsed;
			fileDiv.appendChild(nameSpan);

			filesLoadedDiv.appendChild(fileDiv);
			filesLoadedDiv.appendChild(document.createElement("BR"));
		}
	}



	setupSideModal()
	{
		var that = this;
		if (this.setSideModal)
		{
            var standards = app.standards.standards;

            var categorySelectDiv = document.getElementById("create-challenge-code-category-select-div");
            var subCategorySelectDiv = document.getElementById("create-challenge-code-subcategory-select-div");

            for (var key in standards) {
                var categoryName = key;

                //create a span to insert into div
                var categorySpan = document.createElement("SPAN");
                categorySpan.id = "create-challenge-code-standard-category#" + categoryName;
                categorySpan.innerHTML = categoryName;
                categorySpan.className = "code-review-select-category-span";

                categorySelectDiv.appendChild(categorySpan);

                categorySpan.addEventListener("click", function ()
				{
					// clean sub category
					subCategorySelectDiv.innerHTML = "";

					//show it
					document.getElementById("create-challenge-code-sidenav-issue-subcategory").style.display = "block";

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
						subcategorySpan.id = "create-challenge-code-category#" + subcategories[i].category +"#" +i;
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
		document.getElementById("create-challenge-file-select").innerHTML = "";
		document.getElementById("create-challenge-code-review").innerHTML = "";

		document.getElementById("create-challenge-code-box").classList.remove("box");
		document.getElementById("create-challenge-code-box").classList.add("box-left");
		document.getElementById("create-challenge-submit-div").style.display = "block";
	}

	prepareCodeHTMLs() {
        // Get files and parse them into a highlighted HTML.  Then put them in a parsedCodeHTMLs.
		this.parsedCodeHTMLs["challenge"] = Prism.highlight(this.model.code, Prism.languages.cpp);

		// Now we insert it into a <code> area
		document.getElementById("create-challenge-code-review").innerHTML = this.parsedCodeHTMLs["challenge"];

		// Needed to restore line numbers
		Prism.highlightAllUnder(document.getElementById("create-challenge-precode-area"));
		this.fileOpened = "challenge";
		this.tweakCodeBlock("challenge", true);
    }


	allowReview()
	{
		var that = this;

		document.getElementById("create-challenge-submit-div").style.display = "block";

		var removeEventListener = function ()
		{
			var oldEl = document.getElementById("create-challenge-submit");
			var newEl = oldEl.cloneNode(true);
			oldEl.parentNode.replaceChild(newEl, oldEl);
		};


		document.getElementById("create-challenge-submit").addEventListener("click", function ()
		{
			that.parsedCodeHTMLs = {};

			that.model.storeIssues(that.issues);
			that.model.submitChallenge();

			console.log("Challenge is the following");
			console.log("Text");
			console.log(that.model.code);
			console.log("Issues");
			console.log(that.issues);

			
			app.viewManager.goToView(app.viewManager.VIEW.ASSIGNMENTS_TEACHER);

			removeEventListener();
		});
	}


	setReviewData(filename)
	{
		var reviewTable = document.getElementById("create-challenge-data-table");
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
		var tokens = document.getElementById("create-challenge-code-review").childNodes;
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
					document.getElementById("create-challenge-code-review").replaceChild(span, token);
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

        var sideModal = document.getElementById("create-challenge-code-side-modal");
        sideModal.style.width = "45%";

        // Make an X on a side view to close the side modal
        document.getElementById("create-challenge-code-side-modal-close").addEventListener("click", function () {
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
		var sideModal = document.getElementById("create-challenge-code-side-modal");
        sideModal.style.width = "0";

		document.getElementById("create-challenge-code-subcategory-select-div").innerHTML = "";
		document.getElementById("create-challenge-code-sidenav-issue-subcategory").style.display = "none";


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

		var reviewTable = document.getElementById("create-challenge-data-table");
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
