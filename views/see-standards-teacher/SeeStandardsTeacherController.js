class SeeStandardsTeacherController
{
	constructor(model)
	{
		this.model = model;
		this.setup();
	}

	setup()
	{
		var that = this;
		console.log(this.model);

		//pressing the button will call for an upload window for CVS.
		var addStandards = document.getElementById("add-standards");
		var fileLoad = document.getElementById("standards-html-file");

		addStandards.addEventListener("click", function(){fileLoad.click();} );
		fileLoad.addEventListener("change", function(){that.addStandard();});
	}





	addStandard()
	{
		var that = this;

		var file = document.getElementById("standards-html-file").files[0];
		var data = [];

		var reader = new FileReader();
    	reader.onload = function()
		{

    		var file = reader.result;

			console.log("Read HTML: ", file);
    		that.model.pushStandards(file);
    	};
    	reader.readAsText(file);
	}



	update()
	{

	}
}
