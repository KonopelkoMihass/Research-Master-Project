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
		document.getElementById("profile-std-internalization-progress").innerHTML = "";

		var stdSelectorDiv = document.getElementById("profile-std-selector");
		stdSelectorDiv.innerHTML = "";

		var userStds = this.model.stdInternalisation;
		var hasStds = false;

		for (var k in userStds)
		{
			var button = document.createElement("BUTTON");
			button.id = "profile-std-button#" + k;

			//var stdScoreData = app.standards.getStandardIternalisationLevel(k);

			if (!app.standards.standardsInfo.hasOwnProperty(k)) return;

            var stdName = app.standards.standardsInfo[k].name;

            var scoreData = app.standards.getOverallStandardProgression(k);
            var currentScorePack = scoreData.score;
            var currentMaxPack = scoreData.max;

            var percentage = Math.ceil((currentScorePack.total / currentMaxPack.total) * 100);


			button.innerText = "[ " + percentage + "% / 100% ] " +  stdName;

			button.addEventListener("click", function () {
				document.getElementById("profile-std-internalization-progress").innerHTML = "";
				controller.displaySTDProgress(this.id.split("#")[1], currentScorePack, currentMaxPack);
            });
			stdSelectorDiv.appendChild(button);

			hasStds = true;
		}

		if (!hasStds)
		{
			stdSelectorDiv.innerText = "You have not participated in any challenges yet.  Complete a chain and come back.";
		}
	}

	displaySTDProgress(standardName, currentScorePack, currentMaxPack)
	{
	    var controller = this;

		document.getElementById("profile-std-internalisation-level-div").style.display = "block";
		var stdLevel =  document.getElementById("profile-std-internalisation-level-label");
		var stdProgressDiv = document.getElementById("profile-std-internalization-progress");
		var std = this.model.stdInternalisation[standardName];

		stdLevel.innerHTML = this.model.calculateLevel(standardName);

		var sortedKeys = [];
		var stopSorting = false;
		var subcatNum = 0;

        var getStdByNumber = function(subCategories, i)
        {
            var startValue = 99999;

            for (var j = 0; j < subCategories.length; j++)
            {
                var num = subCategories[j].number;
                num < startValue ? startValue = num : startValue = startValue;
            }



            for (var j = 0; j < subCategories.length; j++)
            {
                if (subCategories[j].number === startValue + i) return subCategories[j];
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

		var focus = this.model.focus;

		for (var c = 0; c < sortedKeys.length; c++)
		{
			var category = std[sortedKeys[c]];

			if (!app.standards.isCategoryUnlockedForUser(standardName, sortedKeys[c])) continue;


			var fieldset = document.createElement("FIELDSET");
			var legend = document.createElement("LEGEND");

			var percentage = Math.ceil((currentScorePack[sortedKeys[c]] / currentMaxPack[sortedKeys[c]]) * 100);
			//button.innerText = "[ " + percentage + "% / 100% ] " +  stdName;


			legend.innerHTML = "[ " + percentage + "% / 100% ] " + sortedKeys[c];
			fieldset.appendChild(legend);
	        stdProgressDiv.appendChild(fieldset);

			for (var i = 0; i < category.subcategories.length; i++)
			{
				var subcat = getStdByNumber(category.subcategories, i);
				if (!app.standards.isSubcategoryUnlocked(standardName, sortedKeys[c], subcat.number)) continue;

				// HAck fix - for a weird reason, some characters in std internalised go corrupted.
                var subcatName = app.standards.getSubcategoryForProfileFix(standardName, sortedKeys[c], subcat.number)



				var subcatFieldset = document.createElement("FIELDSET");
				fieldset.appendChild(subcatFieldset);

				var div = document.createElement("SPAN");
				subcatFieldset.appendChild(div);

				var label = document.createElement("LABEL");
				label.innerHTML =  subcatName;
				subcatFieldset.appendChild(label);

				app.utils.generateSkillProgressBar(div, sortedKeys[c], i, subcat.maxScore, subcat.score );


				var focusButton = document.createElement("BUTTON");
				focusButton.classList.add("profile-focus-button");
				focusButton.innerText = "Focus?";
				focusButton.id = "profile-focus-button#" + sortedKeys[c] + "#" + subcat.name;

				subcatFieldset.appendChild(focusButton);


                if (focus.category === sortedKeys[c] && focus.subCategory === subcat.name)
                {
                    focusButton.innerText = "Focused";
                    focusButton.style.backgroundColor = "#4a8c9a";
                }



				focusButton.addEventListener("click", function()
                {
                    var text = this.innerText;

                    var category = this.id.split("#")[1];
                    var subCategory = this.id.split("#")[2];


                    if (text === "Focused")
                    {
                        this.innerText = "Focus?";
				        this.style.backgroundColor = "#05386b";
                        controller.model.focus = {};
                    }

                    else
                    {
                        if (Object.keys(controller.model.focus).length === 0)
                        {
                            this.innerText = "Focused";
				            this.style.backgroundColor = "#4a8c9a";
				            controller.model.focus = { category:category, subCategory:subCategory};
                        }

                        else
                        {
                            alert("You can focus only on one thing at a time.  Disable your previous focus, then select this focus again.");
                        }
                    }
                    controller.model.saveFocusChange();
                });
















			}


		}
	}

	update()
	{

	}
}
