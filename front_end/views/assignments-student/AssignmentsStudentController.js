class AssignmentsStudentController
{
	constructor(model)
	{
		this.model = model;
		this.filesParsed = {};

		this.setup();
	}

	setup()
	{
		var controller = this;
	}

	createSubmitAssignmentModal(id)
	{
		var controller = this;

		var modalBody = app.modalContentManager.getModalContent("submit-assignment");
		var modalData = app.utils.createModal("add-assignment", "Submit Assignment", modalBody, true);
		modalData.modal.style.display = "block";

		// Find assignment
		var assignment = undefined;
		for (var i = 0; i < this.model.assignments.length; i++)
		{
			if (this.model.assignments[i].id === id)
			{
				assignment = this.model.assignments[i] ;
			}
		}


		document.getElementById("assignment-description").innerText =  assignment.description;
		document.getElementById("assignment-deadline").innerHTML = assignment.deadlineDate + " at " + assignment.deadlineTime;

		// Adds logic to the filedrop area.
		this.prepareFiledropArea(assignment);

		var submitBtn = modalData.submit;
		submitBtn.addEventListener("click", function ()
		{
			controller.submitAssignment(id);
			var parentNode = modalData.modal.parentNode;
			parentNode.removeChild(modalData.modal);

        });
	}

	submitAssignment(assignmentID)
	{
		this.model.submitAssignment(assignmentID, this.filesParsed);
		this.filesParsed = {};
	}

	update()
	{

	}

	uploadFile(name, content)
	{
		this.filesParsed[name] = content;
		this.updateModal();
	}

	deleteFile(name)
	{
		delete this.filesParsed[name];
		this.updateModal();
	}

	updateModal()
	{
		var controller = this;
		var filesLoadedDiv = document.getElementById("files-loaded");
		filesLoadedDiv.innerHTML = "";

		for (var key in this.filesParsed)
		{
			var fileDiv = document.createElement("div");
			fileDiv.className = "file-uploaded-box";

			var deleteSpan = document.createElement("SPAN");
			deleteSpan.innerHTML = "&#10006;  ";
			deleteSpan.id =  "delete-file#" + key;
			deleteSpan.addEventListener("click", function()
			{
				app.annalist.track(this);
				controller.deleteFile(this.id.split("#")[1]);
			});

			fileDiv.appendChild(deleteSpan);

			var nameSpan = document.createElement("SPAN");
			nameSpan.innerHTML = key;
			fileDiv.appendChild(nameSpan);
			filesLoadedDiv.appendChild(fileDiv);
			filesLoadedDiv.appendChild(document.createElement("BR"));

		}
	}


	prepareFiledropArea(assignment)
	{
		var controller = this;

		var fileselect = document.getElementById("file-select");
		var	filedrag = document.getElementById("file-drag");
		var submitbutton = document.getElementById("submit-button");


		var type = assignment.language.toUpperCase();
		if (type === "CPP") {
				type = "CPP or *.H"
		}
		document.getElementById("file-drag").innerHTML = "<br><br><br><br>drop *." + type + " code file here<br><br><br><br>";


		var fileDragHover = function(e) {
			e.stopPropagation();
			e.preventDefault();
			e.target.className = (e.type === "dragover" ? "hover" : "");
		};

		var fileSelectHandler = function (e) {
			fileDragHover(e);
			var files = e.target.files || e.dataTransfer.files;
			for (var i = 0, f; f = files[i]; i++)
			{
				parseFile(f);
			}
		};

		// output file information
		var parseFile = function parseFile(file) {
			var fileFormat = file.name.split(".")[1];

			var checkFormat = fileFormat === assignment.language;

			if (assignment.language === "cpp") {
				checkFormat = fileFormat === "cpp" || fileFormat === "h"
			}


			if (checkFormat)
			{
				var reader = new FileReader();
				reader.onload = function(e) {
					controller.uploadFile(file.name, reader.result);
				};
				reader.readAsText(file);
				document.getElementById("messages").innerHTML = ""
			}
			else {
				document.getElementById("messages").innerHTML = "Failed to load file " + file.name + ".<br>"
			}
		};


		// file select
		fileselect.addEventListener("change", fileSelectHandler, false);
		var xhr = new XMLHttpRequest();
		if (xhr.upload)
		{
			// file drop
			filedrag.addEventListener("dragover", fileDragHover, false);
			filedrag.addEventListener("dragleave", fileDragHover, false);
			filedrag.addEventListener("drop", fileSelectHandler, false);
			filedrag.style.display = "block";

			// remove submit button
			submitbutton.style.display = "none";
		}
	}
}















