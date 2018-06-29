(function() {

	filesParsed = {};


	// getElementById
	function $id(id) {
		return document.getElementById(id);
	}


	// output information
	function output(msg) {
		var m = $id("messages");
		m.innerHTML = msg + m.innerHTML;
	}


	// file drag hover
	function fileDragHover(e) {
		e.stopPropagation();
		e.preventDefault();
		e.target.className = (e.type === "dragover" ? "hover" : "");
	}


	// file selection
	function fileSelectHandler(e) {

		// cancel event and hover styling
		fileDragHover(e);

		// fetch FileList object
		var files = e.target.files || e.dataTransfer.files;

		// process all File objects
		for (var i = 0, f; f = files[i]; i++) {
			parseFile(f);
		}


	}


	// output file information
	function parseFile(file)
	{
		var fileFormat = file.name.split(".")[1];
		if (fileFormat === "cpp" || fileFormat === "h" || fileFormat === "py" ||
			fileFormat === "js"|| fileFormat === "html"|| fileFormat === "css" )
		{
			var reader = new FileReader();

			reader.onload = function(e)
			{
				filesParsed[file.name] = reader.result;

				console.log (file.name, "was parsed successfully");
			};

			reader.readAsText(file);
		}
	}


	// initialize
	function init() {

		var fileselect = $id("fileselect"),
			filedrag = $id("filedrag"),
			submitbutton = $id("submitbutton");

		// file select
		fileselect.addEventListener("change", fileSelectHandler, false);

		// is XHR2 available?
		var xhr = new XMLHttpRequest();
		if (xhr.upload) {

			// file drop
			filedrag.addEventListener("dragover", fileDragHover, false);
			filedrag.addEventListener("dragleave", fileDragHover, false);
			filedrag.addEventListener("drop", fileSelectHandler, false);
			filedrag.style.display = "block";

			// remove submit button
			submitbutton.style.display = "none";
		}

	}

	// call initialization file
	if (window.File && window.FileList && window.FileReader) {
		init();

		document.getElementById("download-all").addEventListener("click", retrievedFromServer)

	}


	function retrievedFromServer()
	{
		// Saving to User PC for testing purposes

		for (const [key, value] of Object.entries(filesParsed))
		{

			var fileName = key;
			var fileContent = value;


            var saveData = (function ()
			{
                var a = document.createElement("a");
                document.body.appendChild(a);
                a.style = "display: none";

                return function (data, fileName)
				{
                    var blob = new Blob([data], {type: "text/plain"});
                    var url = window.URL.createObjectURL(blob);
                    a.href = url;
                    a.download = fileName;
                    a.click();
                    window.URL.revokeObjectURL(url);
                };
            }());

            saveData(fileContent, fileName);
		}
    }



})();