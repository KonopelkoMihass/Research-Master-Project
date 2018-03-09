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


			for (var i = 0; i < model.standards.length; i++)
			{
				var standard = model.standards[i];


				var row = table.insertRow(table.rows.length);

				var cell0 = row.insertCell(0);
				var cell1 = row.insertCell(1);
				var cell2 = row.insertCell(2);


				cell0.innerHTML = standard.category;
				cell1.innerHTML = standard.subCategory;
				cell2.innerHTML = standard.description;
			}




		}

	}


	show()
	{
		super.show();
	}
}
