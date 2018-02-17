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
			console.log(this.viewManager.VIEW[viewName]);
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
		this.templateManager.loadFromCache();
		//models
		this.user = new User();

		this.net.setHost(location.hostname,8080);
		this.net.connect();

		//add views
		this.setupViews();

		this.viewManager.goToView("signin");
	}

	setupViews()
	{
		var signinController = new SigninController(this.user);
		var signinView = new SigninView(signinController);
		this.user.addObserver(signinView, this.net.messageHandler.types.SIGN_IN_SUCCESSFUL);
		this.user.addObserver(signinView, this.net.messageHandler.types.SIGN_IN_FAILED);
		this.viewManager.addView(signinView);

		var signupController = new SignupController(this.user);
		var signupView = new SignupView( signupController);
		this.user.addObserver(signupView, this.net.messageHandler.types.SIGN_UP_SUCCESSFUL);
		this.user.addObserver(signupView, this.net.messageHandler.types.SIGN_UP_FAILED);
		this.viewManager.addView(signupView);

		var profileController = new ProfileController(this.user);
		var profileView = new ProfileView( ProfileController);
		this.viewManager.addView(profileView);

		var assignmentsTeacherController = new AssignmentsTeacherController(this.user);
		var assignmentsTeacherView = new AssignmentsTeacherView( assignmentsTeacherController);
		this.viewManager.addView(assignmentsTeacherView);
	}



	loadResources()
	{
   	 	//Sounds
    	this.audioManager.queueSound("button_click.wav");
	}
}
