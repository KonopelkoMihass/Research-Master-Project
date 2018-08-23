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

			var rowCount = table.rows.length;
			while(--rowCount)
			{
				table.deleteRow(rowCount);
			}

			for (var key in model.standardsInfo)
			{
				var link = document.createElement("a");
				link.setAttribute("href",  model.standardsInfo[key]["url"]);
				var linkText = document.createTextNode(model.standardsInfo[key]["name"]);
				link.appendChild(linkText);

				var row = table.insertRow(table.rows.length);
				var cell = row.insertCell(0);
				cell.appendChild(link);
			}
		}
	}

	show()
	{
		super.show();
	}
}
