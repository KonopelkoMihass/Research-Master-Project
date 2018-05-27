class AssignmentsStudentController
{
	constructor(model)
	{
		this.model = model;
		this.setup();
		this.filesParsed = {};
	}

	setup()
	{
		var controller = this;
		console.log(this.model);
	}

	createSubmitAssignmentModal(id)
	{
		var controller = this;

		var modalBody = app.modalContentManager.getModalContent("submit-assignment");
		var modalData = app.uiFactory.createModal("add-assignment", "Submit Assignment", modalBody, true);
		document.body.appendChild(modalData.modal);
		modalData.modal.style.display = "block";

		// Find assignment
		var assignment = undefined;
		for (var i = 0; i < this.model.assignments.length; i++)
		{
			if( this.model.assignments[i].id === id)
			{
				assignment = this.model.assignments[i] ;
			}

		}

		// Description in modal.
		document.getElementById("assignment-description").innerText = "Description: " + assignment.description;
		document.getElementById("assignment-deadline").innerHTML = "Deadline: " + assignment.deadlineDate + " " + assignment.deadlineTime;


		// Adds logic to the filedrop area.
		this.prepareFiledropArea();


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

	uploadFile(name, content){
		this.filesParsed[name] = content;
		this.updateModal();
	}

	deleteFile(name){
		delete this.filesParsed[name];
		this.updateModal();

	}

	updateModal(){
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


	prepareFiledropArea()
	{
		var controller = this;

		var fileselect = document.getElementById("file-select");
		var	filedrag = document.getElementById("file-drag");
		var submitbutton = document.getElementById("submit-button");


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
			if (fileFormat === "cpp" || fileFormat === "h") {
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















