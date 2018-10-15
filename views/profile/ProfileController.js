class ProfileController
{
	constructor(model)
	{
		this.model = model;
		this.setup();
	}

	setup()
	{
		console.log(this.model);
	}

	setupSTDProgressSelector()
	{
		var controller = this;
		var stdSelectorDiv = document.getElementById("profile-std-selector");
		stdSelectorDiv.innerHTML = "";

		var userStds = this.model.stdInternalisation;
		var hasStds = false;

		for (var k in userStds)
		{
			var button = document.createElement("BUTTON");
			button.id = "profile-std-button#" + k;

			var stdScoreData = app.standards.getStandardIternalisationLevel(k);

			button.innerText = "[" +stdScoreData[0] + "/" + stdScoreData[1] +"] " +  k;
			button.addEventListener("click", function () {
				document.getElementById("profile-std-internalization-progress").innerHTML = "";
				controller.displaySTDProgress(this.id.split("#")[1]);
            });
			stdSelectorDiv.appendChild(button);

			hasStds = true;
		}

		if (!hasStds)
		{
			stdSelectorDiv.innerText = "You have not participated in any challenges yet.  Complete a chain and come back.";
		}
	}

	displaySTDProgress(standardName)
	{
		document.getElementById("profile-std-internalisation-level-div").style.display = "block";
		var stdLevel =  document.getElementById("profile-std-internalisation-level-label");
		var stdProgressDiv = document.getElementById("profile-std-internalization-progress");
		var std = this.model.stdInternalisation[standardName];

		stdLevel.innerHTML = this.model.calculateLevel(standardName);

		var sortedKeys = [];
		var stopSorting = false;
		var subcatNum = 1;
		while (!stopSorting)
		{
			for (var catKey in std)
			{
				if (std[catKey].subcategories[0].number === subcatNum)
				{
					sortedKeys.push(catKey);
					subcatNum += std[catKey].subcategories.length;
					break;
				}
			}

			if (Object.keys(std).length === sortedKeys.length)
			{
				stopSorting = true;
			}
		}

		for (var c = 0; c < sortedKeys.length; c++)
		{
			var category = std[sortedKeys[c]];

			var fieldset = document.createElement("FIELDSET");
			var legend = document.createElement("LEGEND");
			legend.innerHTML = "[" + category.score + "/" + category.maxScore + "] " + sortedKeys[c];
			fieldset.appendChild(legend);

			for (var i = 0; i < category.subcategories.length; i++)
			{
				var subcat = category.subcategories[i];
				var label = document.createElement("LABEL");
				label.innerHTML = "[" + subcat.score + "/" + subcat.maxScore + "] " + subcat.name  ;
				fieldset.appendChild(label);
				fieldset.appendChild(document.createElement("BR"));
			}

			stdProgressDiv.appendChild(fieldset);
		}
	}

	update()
	{

	}
}
