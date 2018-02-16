var app;

function main()
{
	app = new App();
}

/**SpaceRocket**/
class App
{
 	constructor()
 	{
		this.net = new Net();

		this.audioManager = new AudioManager();

		this.viewManager= new ViewManager();
		this.templateManager = new TemplateManager();
		this.uiFactory = new UIFactory();


		//load views
		for (var viewName in this.viewManager.VIEW)
		{
			this.templateManager.queueTemplate(this.viewManager.VIEW[viewName]);
		}

		//load resources
		this.loadResources();

		var that = this;

		this.audioManager.downloadAll(function() {
			that.templateManager.downloadAll(function()	{
				app.setup();
			})});
	}

	setup()
	{
		//models
		this.user = new User();

		this.net.setHost(location.hostname,8080);
		this.net.connect();

		//add views
		this.setupViews();

		//add controllers
		this.setupControllers();

		this.viewManager.goToView("signin");
	}

	setupViews()
	{
		this.viewManager.addView(new SigninView());
		this.viewManager.addView(new SignupView());
	}

	setupControllers()
	{
		this.signinController = new SigninController(this.user);
		this.signupController = new SignupController(this.user);
	}

	loadResources()
	{
   	 	//Sounds
    	this.audioManager.queueSound("button_click.wav");
	}
}
