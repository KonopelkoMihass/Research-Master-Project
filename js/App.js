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
		this.modalContentManager = new ModalContentManager();
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
				that.modalContentManager.downloadAll(function () {
					app.setup();
		});});});
	}

	setup()
	{
		this.templateManager.loadFromCache();

		//models
		this.user = new User();
		this.assignments = new Assignments();

		this.net.setHost(location.hostname,8080);
		this.net.connect();

		//add views
		this.setupViews();

		this.setupMenuPanel();

		this.viewManager.goToView("signin");
	}

	setupViews()
	{
		var signinController = new SigninController(this.user);
		var signinView = new SigninView(signinController);
		this.viewManager.addView(signinView);

		var signupController = new SignupController(this.user);
		var signupView = new SignupView( signupController);
		this.viewManager.addView(signupView);

		var profileController = new ProfileController(this.user);
		var profileView = new ProfileView(profileController);
		this.viewManager.addView(profileView);

		var assignmentsTeacherController = new AssignmentsTeacherController(this.assignments);
		var assignmentsTeacherView = new AssignmentsTeacherView( assignmentsTeacherController);
		this.viewManager.addView(assignmentsTeacherView);

		var assignmentsStudentController = new AssignmentsStudentController(this.assignments);
		var assignmentsStudentView = new AssignmentsStudentView(assignmentsStudentController);
		this.viewManager.addView(assignmentsStudentView);

		this.user.addObserver(signinView, this.net.messageHandler.types.SIGN_IN_SUCCESSFUL);
		this.user.addObserver(signinView, this.net.messageHandler.types.SIGN_IN_FAILED);
		this.user.addObserver(signupView, this.net.messageHandler.types.SIGN_UP_SUCCESSFUL);
		this.user.addObserver(signupView, this.net.messageHandler.types.SIGN_UP_FAILED);


		this.assignments.addObserver(signinView, this.net.messageHandler.types.SIGN_IN_SUCCESSFUL);
		this.assignments.addObserver(assignmentsTeacherView, this.net.messageHandler.types.TEACHER_ASSIGNMENTS_CREATION_SUCCESSFUL);
		this.assignments.addObserver(assignmentsTeacherView, this.net.messageHandler.types.TEACHER_ASSIGNMENTS_CREATION_FAILED);
		this.assignments.addObserver(assignmentsTeacherView, this.net.messageHandler.types.GET_ASSIGNMENTS_SUCCESSFUL);
		this.assignments.addObserver(assignmentsTeacherView, this.net.messageHandler.types.GET_ASSIGNMENTS_FAILED);
		this.assignments.addObserver(assignmentsTeacherView, this.net.messageHandler.types.ASSIGNMENT_DELETE_SUCCESSFUL);
		this.assignments.addObserver(assignmentsTeacherView, this.net.messageHandler.types.ASSIGNMENT_DELETE_FAILED);

		this.assignments.addObserver(assignmentsStudentView, this.net.messageHandler.types.GET_ASSIGNMENTS_SUCCESSFUL);
		this.assignments.addObserver(assignmentsStudentView, this.net.messageHandler.types.ASSIGNMENT_DELETE_SUCCESSFUL);

	}




	setupMenuPanel()
	{
		document.getElementById("mps-profile-button").addEventListener("click", function() {
			if (app.viewManager.currentView.title !== app.viewManager.VIEW.PROFILE)
			{
				app.viewManager.goToView(app.viewManager.VIEW.PROFILE);
			}
		});

		document.getElementById("mps-assignments-button").addEventListener("click", function() {
			if (app.viewManager.currentView.title !== app.viewManager.VIEW.ASSIGNMENTS_STUDENT)
			{
				app.viewManager.goToView(app.viewManager.VIEW.ASSIGNMENTS_STUDENT);
			}
		});



		document.getElementById("mpt-assignments-button").addEventListener("click", function() {
			if (app.viewManager.currentView.title !== app.viewManager.VIEW.ASSIGNMENTS_TEACHER)
			{
				app.viewManager.goToView(app.viewManager.VIEW.ASSIGNMENTS_TEACHER);
			}
		});



	}

	loadResources()
	{
   	 	//Sounds
    	this.audioManager.queueSound("button_click.wav");
	}
}
