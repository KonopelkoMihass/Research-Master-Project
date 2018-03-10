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
		if ( messageType === app.net.messageHandler.types.GET_STANDARD_SUCCESSFUL)
		{
			var table = document.getElementById("standards-table");

			// update review section
			var rowCount = table.rows.length;
			while(--rowCount)
			{
				table.deleteRow(rowCount);
			}


			for (var key in model.standards)
			{
				var substandard = model.standards[key];


				for(var i =0; i< substandard.length; i++)
				{
					var row = table.insertRow(table.rows.length);

					var cell0 = row.insertCell(0);
					var cell1 = row.insertCell(1);
					var cell2 = row.insertCell(2);


					cell0.innerHTML = substandard[i].category;
					cell1.innerHTML = substandard[i].subCategory;
					cell2.innerHTML = substandard[i].description;
				}
			}

		}

	}


	show()
	{
		super.show();
	}
}
