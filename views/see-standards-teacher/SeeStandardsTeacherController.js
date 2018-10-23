class SeeStandardsTeacherController
{
	constructor(model)
	{
		this.model = model;
		this.setup();
	}

	setup()
	{
		var controller = this;
	}

	update()
	{

	}

	saveStandardConfigurations(){
		this.model.saveStandardConfigurations();
	}

}
