class CodeViewController
{
	constructor(model)
	{
		this.model = model;
		this.setup();
		this.codeFiles = {};
	}

	setup()
	{
		var that = this;
		console.log(this.model);
	}

	cleanUp()
	{
		this.codeFiles = {};
		document.getElementById("file-select").innerHTML = "";
		document.getElementById("code-review").innerHTML = "";

		document.getElementsByClassName("code-block")[0].classList.remove("code-block-centralised");
		document.getElementsByClassName("review-block")[0].style.display = "block";
	}



	prepareCodeHTMLs()
	{
		this.cleanUp();

		var controller = this;
		// Get files
		for (var i = 0; i <	this.model.submissions.length; i++)
		{
			if (this.model.submissions[i].id === this.model.submissionCodeToView)
			{
				var submissionFiles = this.model.submissions[i].submissionData;
				for (var name in submissionFiles)
				{
					this.codeFiles[name] = Prism.highlight(submissionFiles[name], Prism.languages.cpp);
				}
			}
		}

		//Add file button selector
		var fileDiv = document.getElementById("file-select");
		for (var name in this.codeFiles)
		{
			var button = document.createElement("BUTTON");
			button.innerHTML = name;
			button.addEventListener("click", function ( )
            {
				console.log(this.innerHTML);

				 // Now we insert it into a <code> area
    			var codeArea = document.getElementById("code-review");
				codeArea.innerHTML = controller.codeFiles[this.innerHTML];

				// Needed to restore line numbers
    			Prism.highlightAllUnder(document.getElementById("precode-area"));

			});

			fileDiv.appendChild(button);
		}
	}

	// Hide Review/ commenting div and reposition code view.
	setViewAsClear()
	{
		document.getElementsByClassName("code-block")[0].classList.add("code-block-centralised");
		document.getElementsByClassName("review-block")[0].style.display = "none";

	}




	update()
	{

	}
}
