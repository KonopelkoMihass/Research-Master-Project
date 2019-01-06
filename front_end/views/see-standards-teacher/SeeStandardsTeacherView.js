/**Responsible for displaying what the user sees**/
class SeeStandardsTeacherView extends View
{
	constructor(controller)
	{
		super();

		this.title = app.viewManager.VIEW.SEE_STANDARDS_TEACHER;
		this.controller = controller;
		this.setup();
	}

	onNotify (model, messageType)
	{
		var view = this;
		if ( messageType === app.net.messageHandler.types.GET_STANDARD_SUCCESSFUL)
		{
			var selector = document.getElementById("see-standards-selector");
			selector.innerHTML = "";
			for (var key in model.standardsInfo)
			{
				var button = document.createElement("BUTTON");
				selector.appendChild(button);

				button.innerHTML = model.standardsInfo[key]["name"];
				button.id = "see-standards-button#" + key;
				button.addEventListener("click", function(){
					var k = this.id.split("#")[1];
					view.setupStandardView(k, model.standardsInfo[k]);
				});

			}

			app.utils.assignFuncToButtonViaID("see-standards-save-standard-configurations", function(){
				view.controller.saveStandardConfigurations();
			});
		}

		if ( messageType === app.net.messageHandler.types.UPDATE_STANDARDS_CONFIG_SUCCESSFUL)
		{
			alert("Configurations were successfully saved.");
		}
	}


	sortCategories(standards)
    {
        var stdNumber = 0;
        var sortedKeys = [];
        var totalCategories = Object.keys(standards).length;

        while(true){
            for (var key in standards) {
                for (var i = 0; i < standards[key].length; i++) {
                    if (stdNumber == standards[key][i].number)
                    {
                        sortedKeys.push(key);
                        stdNumber += standards[key].length;
                    }
                }
            }
            if (Object.keys(sortedKeys).length === totalCategories)
            {
                break;
            }
        }

        return sortedKeys;
    }





	setupStandardView(stdName, info)
	{
		var view = this;
		var linkDiv = document.getElementById("std-doc-link");
		var table = document.getElementById("see-standard-teacher-table");

		var standards = this.controller.model.selectStandards(stdName);

		// remove all data in there.
		var rowCount = table.rows.length;
		while(--rowCount)
		{
			table.deleteRow(rowCount);
		}

		linkDiv.innerText = "Link: ";
		var link = document.createElement("a");
		link.setAttribute("href", info.url);
		link.appendChild(document.createTextNode(info.name));
		linkDiv.appendChild(link);


		var sortedKeys = this.sortCategories(standards);


		for (var k = 0; k < sortedKeys.length; k++) {
		    var cat = sortedKeys[k];
			var category = standards[cat];

			// Check that this category has sub standards related to this coding standard
			var hasSubStandardsNeeded = false;
			for (var i = 0; i < category.length; i++)
			{
				if (category[i].name === stdName)
				{
					hasSubStandardsNeeded = true;
					break;
				}
			}
			if (!hasSubStandardsNeeded) continue;

			var row = table.insertRow(table.rows.length);
			var cell0 = row.insertCell(0);
			var cell1 = row.insertCell(1);
			var cell2 = row.insertCell(2);
			var cell3 = row.insertCell(3);
			var cell4 = row.insertCell(4);
			var cell5 = row.insertCell(5);

			// "Enabled" Cell
			cell0.id = "see-standards-table-enabled#" + cat + "#yes";
			cell0.style.cursor = "pointer";
			cell0.addEventListener("click",function ()
			{
				var categoryName = this.id.split("#")[1];
				var state = this.id.split("#")[2];
				var rowNumber = this.parentNode.rowIndex;

				if (state === "no")
				{
					state = "yes";
					this.innerHTML = "&#10004;";
				}
				else
				{
					state = "no";
					this.innerHTML = "&#10005;";
				}
				this.id = "see-standards-table-enabled#" + categoryName + "#" + state;
				view.setCategoryEnableState(categoryName , state);


            });
			view.resetStateForCategoryCell(cat);


			//Name
			cell1.innerText = "Category: " + cat;

			// Collapse
			cell5.id = "see-standards-table-collapsed#" + cat + "#no";
			cell5.innerHTML = "&#43;";
			cell5.style.cursor = "pointer";

			cell5.addEventListener("click",function ()
			{
				var categoryName = this.id.split("#")[1];
				var state = this.id.split("#")[2];
				var rowNumber = this.parentNode.rowIndex;

				if (state === "no")
				{
					this.id = "see-standards-table-collapsed#" + categoryName + "#yes";
					this.innerHTML = "&#8722;";
					view.addSubcategoryRows(rowNumber, standards[categoryName]);

				}
				else
				{
					this.id = "see-standards-table-collapsed#" + categoryName + "#no";
					this.innerHTML = "&#43;";
					view.deleteSubcategoryRows(categoryName);
				}


				// colour all the necessary rows a darker tone if disabled.
                var localTable = document.getElementById("see-standard-teacher-table");
				for (var i = 0, row; row = localTable.rows[i]; i++) {
				    var cell0 = row.cells[0];
				    if (cell0.id.split('#')[3] === "no")
				    {
				        cell0.click();
				        cell0.click();
                    }

                }
            });





		}
	}

	addSubcategoryRows(rowIndex, subCategories)
	{
		var view = this;
		var table = document.getElementById("see-standard-teacher-table");


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

		for (var i = 0; i < subCategories.length; i++)
		{
			var subCat = getStdByNumber(subCategories, i);

			var row = table.insertRow(rowIndex + 1 + i);
			row.setAttribute("name", "see-standards-substandards#" + subCat.category);
			var cell0 = row.insertCell(0);
			var cell1 = row.insertCell(1);
			var cell2 = row.insertCell(2);
			var cell3 = row.insertCell(3);
			var cell4 = row.insertCell(4);
			var cell5 = row.insertCell(5);

			// "Enabled" Cell
			var enabled = subCat.enabled;
			cell0.id = "see-standards-table-enabled#" +subCat.category + "#"+ subCat.subCategory + "#" + enabled;

			cell0.innerHTML = enabled === "yes" ? "&#10004;" : "&#10005;";
			//row.style.backgroundColor = enabled === "yes" ? "" : "#2d2d2d;";
			cell0.style.cursor = "pointer";

			cell0.addEventListener("click",function ()
			{
				var category = this.id.split("#")[1];
				var name = this.id.split("#")[2];
				var state = this.id.split("#")[3];

				if (state === "no")
				{
					state = "yes";
					this.innerHTML = "&#10004;";
					this.parentNode.style.backgroundColor = "";

				}
				else
				{
					state = "no";
					this.innerHTML = "&#10005;";
                    this.parentNode.style.backgroundColor = "#2d2d2d";

				}
				this.id = "see-standards-table-enabled#" + category + "#" + name + "#" + state;

				view.setSubcategoryEnableState(category, name, state);
            });

			//Name
			cell1.innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;" + subCat.subCategory;

			// Reward Score
			var rewardInput = this.createNumberInput("see-standards-reward-score#" +subCat.category + "#" + subCat.subCategory, subCat.rewardScore, true);
			cell2.appendChild(rewardInput);
			rewardInput.addEventListener("change", function () {
				var category = this.id.split("#")[1];
				var subCategory = this.id.split("#")[2];
				var catList = view.controller.model.standards[category];
				for (var i = 0; i < catList.length; i++)
				{
					if (catList[i].subCategory === subCategory) catList[i].rewardScore = this.value;
				}
            });

			// Penalty Score
			var penaltyInput = this.createNumberInput("see-standards-reward-score#" +subCat.category + "#" + subCat.subCategory, subCat.penaltyScore, true);
			cell3.appendChild(penaltyInput);
			penaltyInput.addEventListener("change", function () {
				var category = this.id.split("#")[1];
				var subCategory = this.id.split("#")[2];
				var catList = view.controller.model.standards[category];
				for (var i = 0; i < catList.length; i++)
				{
					if (catList[i].subCategory === subCategory) catList[i].penaltyScore = this.value;
				}
            });

			cell4.style.cursor = "pointer";

			// Leveling field
            var levelInput = this.createNumberInput("see-standards-table-unlock-at-level#" + subCat.category + "#" + subCat.subCategory, subCat.unlockedAtLevel, false);
            levelInput.addEventListener("change",function ()
			{
                var category = this.id.split("#")[1];
				var subCategory = this.id.split("#")[2];
				var catList = view.controller.model.standards[category];
				for (var i = 0; i < catList.length; i++)
				{
					if (catList[i].subCategory === subCategory)
					    catList[i].unlockedAtLevel = this.value;
				}
            });


            cell4.appendChild(levelInput);




		}

	}

	deleteSubcategoryRows(categoryName)
	{
		var rows = document.getElementsByName("see-standards-substandards#" + categoryName);
		while (rows.length > 0)
		{
			 rows[rows.length-1].remove();
		}
	}

	createNumberInput(id, currentValue, limitToFive)
	{
		var input = document.createElement("INPUT");
		input.type = "number";
		input.min = "1";
        if (limitToFive)
		    input.max = "5";
        else
            input.max = "99";

		input.id = id;
		input.value = currentValue;
		return input;
	}

	resetStateForCategoryCell(category)
	{
		var cell = document.getElementById("see-standards-table-enabled#" + category + "#no");
		if (cell === null) cell = document.getElementById("see-standards-table-enabled#" + category + "#yes");
		if (cell === null) cell = document.getElementById("see-standards-table-enabled#" + category + "#either");

		var catList = this.controller.model.standards[category];

		var disabled = 0;
		var enabled = 0;
		var result = "";

		for (var i = 0; i < catList.length; i++)
		{
			catList[i].enabled === "yes" ? enabled++ : disabled++;
		}

		if (disabled > 0 && enabled > 0)
		{
			result = "either"
		}

		else if (disabled > 0)
		{
			result = "no";
		}

		else result = "yes";

		cell.id = "see-standards-table-enabled#" + category + "#" + result;
		cell.innerHTML =  result === "either"  ?  " &#9673;" : result === "yes" ? "&#10004;" : "&#10005;" ;

	}



	setCategoryEnableState(category, state)
	{
		var catList = this.controller.model.standards[category];

		for (var i = 0; i < catList.length; i++)
		{
			var oldState = catList[i].enabled;
			catList[i].enabled = state;

			var cell = document.getElementById("see-standards-table-enabled#" + category + "#"+ catList[i].subCategory + "#" + oldState);
			if (cell !== null)
			{
				cell.id = "see-standards-table-enabled#" + category + "#" + catList[i].subCategory + "#" + state;
				cell.innerHTML =  state === "either"  ?  " &#9673;" : state === "yes" ? "&#10004;" : "&#10005;" ;
			}


		}
		this.resetStateForCategoryCell(category);
	}

	setSubcategoryEnableState(category, name, state)
	{
		var catList = this.controller.model.standards[category];

		for (var i = 0; i < catList.length; i++)
		{
			if (catList[i].subCategory === name)
			{
				var oldState = catList[i].enabled;
				catList[i].enabled = state;
			}
		}
		this.resetStateForCategoryCell(category);
	}




	show()
	{
		super.show();
	}
}
