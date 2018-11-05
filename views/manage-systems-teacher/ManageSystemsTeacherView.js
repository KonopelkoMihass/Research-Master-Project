class ManageSystemsTeacherView extends View
{
	constructor(controller)
	{
		super();

		this.title = app.viewManager.VIEW.MANAGE_SYSTEMS_TEACHER;
		this.controller = controller;
		this.setup();
	}

	onNotify (model, messageType)
	{
		var view = this;

		// Update the table of assessments
		if (messageType === app.net.messageHandler.types.GET_STUDENTS_SUCCESSFUL ||
			messageType === app.net.messageHandler.types.INVERT_SYSTEMS_SUCCESSFUL ||
			messageType === app.net.messageHandler.types.ENABLE_SYSTEM_SWITCH_SUCCESSFUL)
		{
			this.setupStudentTable();
		}
	}

	setupStudentTable()
	{
		var table = document.getElementById("manage-systems-teacher-table");
		var rowCount = table.rows.length;
		while(--rowCount)
		{
			table.deleteRow(rowCount);
		}

		var students = this.controller.model.students;
		for (var i = 0; i < students.length; i++)
		{
			var row = table.insertRow(table.rows.length);

			var cell0 = row.insertCell(0);
			var button = document.createElement("BUTTON");
			button.innerText = "Get";
			button.id = "manage-systems-get-performance#" + students[i].email;
			button.addEventListener("click", function(){
			    var email = this.id.split("#")[1];
                app.students.getPerformanceData(email);
            });

			cell0.appendChild(button);


			var cell1 = row.insertCell(1);
			cell1.innerText = students[i].surname + " " + students[i].name;
			var cell2 = row.insertCell(2);
			cell2.innerText = students[i].noun;

			var cell3 = row.insertCell(3);
			var noLevel = true;
			for (var name in students[i].std_internalisation)
			{
				noLevel = false;
				var std = students[i].std_internalisation[name];
           	 	var level = 1;

           	 	for (var key in std)
				{
					for (var j = 0; j < std[key].subcategories.length; j++)
					{
						if (std[key].subcategories[j].score >= 7)
						{
							level++;
						}
					}
				}

				cell3.innerText += name + ": " + level + "\n" ;
			}

			if (noLevel)
			{
				cell3.innerText = "No levels"
			}


			var cell4 = row.insertCell(4);
			cell4.innerText = students[i].gamification === 'r' ? "Choose" :  students[i].gamification === 'y' ? "Yes" : "No" ;
		}
	}


	show()
	{
		super.show();
	}
}
