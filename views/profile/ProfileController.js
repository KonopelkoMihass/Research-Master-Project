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


		var userStds = this.model.stdInternalisation;
		var hasStds = false;

		for (var k in userStds)
		{
			var button = document.createElement("BUTTON");
			button.id = "profile-std-button#" + k;
			button.innerText = k;
			button.addEventListener("click", function () {
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
		var stdProgressDiv = document.getElementById("profile-std-internalization-progress");
		var std = this.model.stdInternalisation[standardName];



		for (var catKey in std)
		{
			var category = std[catKey];

			var fieldset = document.createElement("FIELDSET");
			var legend = document.createElement("LEGEND");
			legend.innerHTML = "[" + category.score + "/" + category.maxScore + "] " +catKey;
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
