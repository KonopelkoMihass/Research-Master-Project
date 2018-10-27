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

			if (!app.standards.standardsInfo.hasOwnProperty(k)) return;

            var stdName = app.standards.standardsInfo[k].name;


            var percentage = Math.ceil((parseInt(stdScoreData[0]) / parseInt(stdScoreData[1])) * 100);
			button.innerText = "[ " + percentage + "% / 100% ] " +  stdName;

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

        var getStdByNumber = function(subCategories, i)
        {
            for (var j = 0; j < subCategories.length; j++)
            {
                if (subCategories[j].number === i) return subCategories[j];
            }
        };


		while (!stopSorting)
		{
			for (var catKey in std)
			{
			    for (var i = 0; i < std[catKey].subcategories.length; i++)
			    {
                    if (std[catKey].subcategories[i].number === subcatNum)
                    {
                        sortedKeys.push(catKey);
                        subcatNum += std[catKey].subcategories.length;
                        break;
                    }
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

			var percentage = Math.ceil((parseInt(category.score) / parseInt(category.maxScore)) * 100);
			//button.innerText = "[ " + percentage + "% / 100% ] " +  stdName;


			legend.innerHTML = "[ " + percentage + "% / 100% ] " + sortedKeys[c];
			fieldset.appendChild(legend);

			for (var i = 0; i < category.subcategories.length; i++)
			{
				var subcat = getStdByNumber(category.subcategories, i);
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
