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

		this.issuesFound = {};
		this.standardUsed = "";
		this.codingLanguageUsed = "";
	}

	setup()
	{
		console.log(this.model);
	}

	correctTimeInput()
	{
		var minutesElem = document.getElementById("create-challenge-time-minutes");
		var secondsElem = document.getElementById("create-challenge-time-seconds");

		minutesElem.addEventListener("input", function(){
			if (this.value > 60)
			{
        		this.value = 60;
			}
		});

		secondsElem.addEventListener("input", function(){
			if (this.value > 60) {
				var overflow = ~~(this.value/ 60); // will return whole number.
				minutesElem.value = parseInt(minutesElem.value) + parseInt(overflow);
				if (minutesElem.value > 60) {
					minutesElem.value = 60;
					this.value = 0;
				}
        		this.value = this.value % 60;
			}
		});
    }


	createSubmitChallengeFileModal()
	{
		var controller = this;

		var modalBody = app.modalContentManager.getModalContent("submit-challenge-file");
		var modalData = app.utils.createModal("create-challenge", "Submit Challenge File", modalBody, true);
		document.body.appendChild(modalData.modal);
		modalData.modal.style.display = "block";

		var closes = modalData.closes;
		for (var i = 0; i < closes.length; i++) {
			closes[i].addEventListener("click", function () {
				app.viewManager.goToView(app.viewManager.VIEW.ASSIGNMENTS_TEACHER);
			});
		}

		// Adds logic to the filedrop area.
		this.prepareFiledropArea();

		// fill the select box
		var selectStandard = document.getElementById("create-challenge-standards");

		var standards = app.standards;
		for (var key in standards.standardsInfo)
		{
			var option = document.createElement("option");
			option.text = standards.standardsInfo[key]["name"] + " Coding Standard";
			option.value = key;
			selectStandard.add(option);
		}

		selectStandard.addEventListener("change", function()
		{
			var type = this.value.split('-')[0].toUpperCase();
			if (type === "CPP") {
				type = "CPP or *.H"
			}

			controller.standardUsed = this.value;
			controller.codingLanguageUsed = this.value.split('-')[0];

			document.getElementById("challenge-file-drag").innerHTML = "<br><br><br><br>drop *." + type + " code file here<br><br><br><br>";
		});

		var submitBtn = modalData.submit;

		submitBtn.addEventListener("click", function ()
		{
			if (controller.model.code === "")
			{
				alert("You did not submit a file");
			}
			else
			{
				document.getElementById("view-title").innerText = "Create Challenge";

				controller.correctTimeInput();
				controller.setStandardAndLanguageUsed();
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

	setStandardAndLanguageUsed()
	{
		var selectStandard = document.getElementById("create-challenge-standards");
		this.standardUsed = selectStandard.options[selectStandard.selectedIndex].value;
		this.codingLanguageUsed = this.standardUsed.split('-')[0];
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
			var checkFormat = fileFormat === controller.codingLanguageUsed;

			if (controller.codingLanguageUsed === "cpp") {
				checkFormat = fileFormat === "cpp" || fileFormat === "h"
			}


			if (checkFormat)
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

			// if a standard is changed - we drop the uploaded file
			var selectStandard = document.getElementById("create-challenge-standards");
			selectStandard.addEventListener("change", function() {
				deleteSpan.click();
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
		var controller = this;
		if (this.setSideModal)
		{
            var standards = app.standards.selectStandards(this.standardUsed);
            var categorySelectDiv = document.getElementById("create-challenge-code-category-select-div");
			categorySelectDiv.innerHTML = "";


            for (var key in standards) {
                var categoryName = key;

                //create a span to insert into div
                var categorySpan = document.createElement("SPAN");
                categorySpan.id = "create-challenge-code-standard-category#" + categoryName;
                categorySpan.innerHTML = categoryName;
                categorySpan.className = "code-review-select-category-span";

                var subCategoryDiv = document.createElement("div");
                subCategoryDiv.id = "create-challenge-code-standard-subcategory-div#" + categoryName;

				categorySelectDiv.appendChild(categorySpan);
                categorySelectDiv.appendChild(subCategoryDiv);

                categorySpan.addEventListener("click", function ()
				{
					var localSubCategoryDiv = document.getElementById("create-challenge-code-standard-subcategory-div#" + this.id.split("#")[1]);
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
							subcategorySpan.id = "create-challenge-code-category#" + subcategories[i].category +"#" +i;
							subcategorySpan.innerHTML = subcategories[i].subCategory;
							subcategorySpan.className = "code-review-select-subcategory-span";

							app.utils.insertTooltip(subcategorySpan, subcategories[i].description);

							var img = document.createElement("IMG");
							img.src = "resources/images/search.png";
							img.id = "create-challenge-select-subcategory-tooltip#" + subcategories[i].category + "#" + i;
							img.className = "picture-button";
							img.style.float = "right";

							img.addEventListener("mouseover",function ()
							{
								var category = this.id.split("#")[1];
								var idNum = this.id.split("#")[2];

								var subCatSpan = document.getElementById("create-challenge-code-category#" + category + "#" + idNum);

								var tootlipElem = subCatSpan.getElementsByClassName("tooltiptext")[0];
								tootlipElem.style.visibility = "visible";
								tootlipElem.style.opacity= "1";

							});
							img.addEventListener("mouseleave",function ()
							{
								var category = this.id.split("#")[1];
								var idNum = this.id.split("#")[2];

								var subCatSpan = document.getElementById("create-challenge-code-category#" + category + "#" + idNum);

								var tootlipElem = subCatSpan.getElementsByClassName("tooltiptext")[0];
								tootlipElem.style.visibility = "hidden";
								tootlipElem.style.opacity= "0";
							});


							subcategorySpan.addEventListener("click", function ()
							{
								var lCategory =  this.id.split("#")[1];
								var lSubCategory =  this.id.split("#")[2];
								var resultStandard = app.standards.standards[lCategory][lSubCategory];

								controller.closeSidenavAndSaveTheReview("issue", resultStandard)
								subCategoryDiv.innerHTML = "";
							});

							spanContainer.appendChild(subcategorySpan);
							spanContainer.appendChild(img);

							localSubCategoryDiv.appendChild(spanContainer)
						}
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
		this.parsedCodeHTMLs["challenge"] = Prism.highlight(this.model.code, app.utils.derivePrismLanguage(this.codingLanguageUsed));

		// Now we insert it into a <code> area
		document.getElementById("create-challenge-code-review").innerHTML = this.parsedCodeHTMLs["challenge"];

		// Needed to restore line numbers
		Prism.highlightAllUnder(document.getElementById("create-challenge-precode-area"));
		this.fileOpened = "challenge";
		this.tweakCodeBlock("challenge", true);
    }


	allowReview()
	{
		var controller = this;

		document.getElementById("create-challenge-submit-div").style.display = "block";

		var removeEventListener = function ()
		{
			var oldEl = document.getElementById("create-challenge-submit");
			var newEl = oldEl.cloneNode(true);
			oldEl.parentNode.replaceChild(newEl, oldEl);
		};

		document.getElementById("create-challenge-submit").addEventListener("click", function ()
		{
			controller.parsedCodeHTMLs = {};
			controller.model.storeIssues(controller.issuesFound);

			var minutes = document.getElementById("create-challenge-time-minutes").value;
			var seconds = document.getElementById("create-challenge-time-seconds").value;

			controller.model.storeParameters(minutes, seconds, controller.standardUsed, controller.codingLanguageUsed);
			controller.model.submitChallenge();

			app.viewManager.goToView(app.viewManager.VIEW.ASSIGNMENTS_TEACHER);


			controller.issuesFound = {};
			controller.standardUsed = "";
			controller.codingLanguageUsed = "";
			controller.setSideModal = true;
			controller.cleanUp();

			// Now we insert it into a <code> area
			document.getElementById("create-challenge-code-review").innerHTML = "";





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
		delete this.issuesFound[id];
		var rowToDelete = document.getElementById(id + "-row");
		rowToDelete.parentNode.removeChild(rowToDelete);
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


		this.issuesFound[id] = codeBit;

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