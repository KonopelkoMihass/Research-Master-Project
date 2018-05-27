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


	heartbeat()
	{
		app.net.sendMessage("heartbeat", {});
	}

	setup()
	{
		this.templateManager.loadFromCache();

		//models
		this.user = new User();
		this.assignments = new Assignments();
		this.submissions = new Submissions();
		this.standards = new Standards();

		this.net.setHost(location.hostname,443); // replace with 8080 when putting on gamecore
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

		var feedbackController = new FeedbackController(this.submissions);
		var feedbackView = new FeedbackView(feedbackController);
		this.viewManager.addView(feedbackView);

		var performReviewController = new PerformReviewStudentController(this.submissions);
		var performReviewView = new PerformReviewStudentView(performReviewController);
		this.viewManager.addView(performReviewView);

		var seeStandardsStudentController = new SeeStandardsStudentController(this.standards);
		var seeStandardsStudentView = new SeeStandardsStudentView(seeStandardsStudentController);
		this.viewManager.addView(seeStandardsStudentView);

		var seeStandardsTeacherController = new SeeStandardsTeacherController(this.standards);
		var seeStandardsTeacherView = new SeeStandardsTeacherView(seeStandardsTeacherController);
		this.viewManager.addView(seeStandardsTeacherView);

		var seeSubmissionsStudentController = new SeeSubmissionsStudentController(this.submissions);
		var seeSubmissionsStudentView = new SeeSubmissionsStudentView(seeSubmissionsStudentController);
		this.viewManager.addView(seeSubmissionsStudentView);

		var seeSubmissionsTeacherController = new SeeSubmissionsTeacherController(this.submissions);
		var seeSubmissionsTeacherView = new SeeSubmissionsTeacherView(seeSubmissionsTeacherController);
		this.viewManager.addView(seeSubmissionsTeacherView);

		var codeViewController = new CodeViewController(this.submissions);
		var codeView = new CodeView(codeViewController);
		this.viewManager.addView(codeView);




		// KEEP ADDING OBSERVERS AS THEY ARE NEEDED

		// On entering a system, we need to store user info or notify user if he failed to enter the system
		this.user.addObserver(signinView, this.net.messageHandler.types.SIGN_IN_SUCCESSFUL);
		this.user.addObserver(signinView, this.net.messageHandler.types.SIGN_IN_FAILED);
		this.user.addObserver(signupView, this.net.messageHandler.types.SIGN_UP_SUCCESSFUL);
		this.user.addObserver(signupView, this.net.messageHandler.types.SIGN_UP_FAILED);


		// Teacher - Assignment
		this.assignments.addObserver(assignmentsTeacherView, this.net.messageHandler.types.TEACHER_ASSIGNMENTS_CREATION_SUCCESSFUL);
		this.assignments.addObserver(assignmentsTeacherView, this.net.messageHandler.types.TEACHER_ASSIGNMENTS_CREATION_FAILED);
		this.assignments.addObserver(assignmentsTeacherView, this.net.messageHandler.types.GET_ASSIGNMENTS_SUCCESSFUL);
		this.assignments.addObserver(assignmentsTeacherView, this.net.messageHandler.types.GET_ASSIGNMENTS_FAILED);
		this.assignments.addObserver(assignmentsTeacherView, this.net.messageHandler.types.ASSIGNMENT_DELETE_SUCCESSFUL);
		this.assignments.addObserver(assignmentsTeacherView, this.net.messageHandler.types.ASSIGNMENT_DELETE_FAILED);

		// Student - Assignment
		this.assignments.addObserver(assignmentsStudentView, this.net.messageHandler.types.GET_ASSIGNMENTS_SUCCESSFUL);
		this.assignments.addObserver(assignmentsStudentView, this.net.messageHandler.types.ASSIGNMENT_DELETE_SUCCESSFUL);
		this.submissions.addObserver(assignmentsStudentView, this.net.messageHandler.types.SUBMIT_ASSIGNMENT_SUCCESSFUL);
		this.submissions.addObserver(assignmentsStudentView, this.net.messageHandler.types.GET_SUBMISSIONS_SUCCESSFUL);


		// Student - Submission
		this.submissions.addObserver(seeSubmissionsStudentView, this.net.messageHandler.types.SUBMIT_ASSIGNMENT_SUCCESSFUL);
		this.submissions.addObserver(seeSubmissionsStudentView, this.net.messageHandler.types.GET_SUBMISSIONS_SUCCESSFUL);
		this.submissions.addObserver(feedbackView, this.net.messageHandler.types.GET_SUBMISSIONS_SUCCESSFUL);


		// Teacher - Submission
		this.submissions.addObserver(seeSubmissionsTeacherView, this.net.messageHandler.types.SUBMIT_ASSIGNMENT_SUCCESSFUL);
		this.submissions.addObserver(seeSubmissionsTeacherView, this.net.messageHandler.types.GET_SUBMISSIONS_SUCCESSFUL);
		this.submissions.addObserver(seeSubmissionsTeacherView, this.net.messageHandler.types.SUBMIT_REVIEW_SUCCESSFUL);


		// Student - Reviews To Do
		this.submissions.addObserver(performReviewView, this.net.messageHandler.types.SUBMIT_ASSIGNMENT_SUCCESSFUL);
		this.submissions.addObserver(performReviewView, this.net.messageHandler.types.GET_SUBMISSIONS_SUCCESSFUL);
		this.submissions.addObserver(performReviewView, this.net.messageHandler.types.SUBMIT_REVIEW_SUCCESSFUL);


		// Teacher - Standards
		this.standards.addObserver(seeStandardsTeacherView, this.net.messageHandler.types.PUSH_STANDARD_SUCCESSFUL);
		this.standards.addObserver(seeStandardsTeacherView, this.net.messageHandler.types.GET_STANDARD_SUCCESSFUL);


		this.standards.addObserver(seeStandardsStudentView, this.net.messageHandler.types.GET_STANDARD_SUCCESSFUL);
	}

	setupMenuPanel()
	{
		var viewLabel = document.getElementById("view-title");

		document.getElementById("mps-profile-button").addEventListener("click", function() {
			if (app.viewManager.currentView.title !== app.viewManager.VIEW.PROFILE)
			{
				app.viewManager.goToView(app.viewManager.VIEW.PROFILE);
				viewLabel.innerText = "Your Profile";
			}
		});

		document.getElementById("mps-assignments-button").addEventListener("click", function() {
			if (app.viewManager.currentView.title !== app.viewManager.VIEW.ASSIGNMENTS_STUDENT)
			{
				app.viewManager.goToView(app.viewManager.VIEW.ASSIGNMENTS_STUDENT);
				viewLabel.innerText = "Assignments";
			}
		});

		document.getElementById("mps-standards-button").addEventListener("click", function() {
			if (app.viewManager.currentView.title !== app.viewManager.VIEW.SEE_STANDARDS_STUDENT)
			{
				app.viewManager.goToView(app.viewManager.VIEW.SEE_STANDARDS_STUDENT);
				viewLabel.innerText = "Standards Available";
			}
		});

		document.getElementById("mps-reviews-button").addEventListener("click", function() {
			if (app.viewManager.currentView.title !== app.viewManager.VIEW.PERFORM_REVIEW_STUDENT)
			{
				app.viewManager.goToView(app.viewManager.VIEW.PERFORM_REVIEW_STUDENT);
				viewLabel.innerText = "Reviews To Do";
			}
		});

		document.getElementById("mps-feedback-button").addEventListener("click", function() {
			if (app.viewManager.currentView.title !== app.viewManager.VIEW.FEEDBACK)
			{
				app.viewManager.goToView(app.viewManager.VIEW.FEEDBACK);
				viewLabel.innerText = "Feedback You Received";
			}
		});

		document.getElementById("mps-submissions-button").addEventListener("click", function() {
			if (app.viewManager.currentView.title !== app.viewManager.VIEW.SEE_SUBMISSIONS_STUDENT)
			{
				app.viewManager.goToView(app.viewManager.VIEW.SEE_SUBMISSIONS_STUDENT);
				viewLabel.innerText = "Your Submissions";
			}
		});



		document.getElementById("mpt-assignments-button").addEventListener("click", function() {
			if (app.viewManager.currentView.title !== app.viewManager.VIEW.ASSIGNMENTS_TEACHER)
			{
				app.viewManager.goToView(app.viewManager.VIEW.ASSIGNMENTS_TEACHER);
				viewLabel.innerText = "Assignments";
			}
		});

		document.getElementById("mpt-standards-button").addEventListener("click", function() {
			if (app.viewManager.currentView.title !== app.viewManager.VIEW.SEE_STANDARDS_TEACHER)
			{
				app.viewManager.goToView(app.viewManager.VIEW.SEE_STANDARDS_TEACHER);
				viewLabel.innerText = "Standards Available";
			}
		});

		document.getElementById("mpt-submissions-button").addEventListener("click", function() {
			if (app.viewManager.currentView.title !== app.viewManager.VIEW.SEE_SUBMISSIONS_TEACHER)
			{
				app.viewManager.goToView(app.viewManager.VIEW.SEE_SUBMISSIONS_TEACHER);
				viewLabel.innerText = "Student's Submissions";
			}
		});
	}

	loadResources()
	{
   	 	//Sounds
    	this.audioManager.queueSound("button_click.wav");
    	this.audioManager.queueSound("space-ship-flight.wav");
	}
}



getRandomAdjective = function () {
	var result = Math.floor(Math.random() * 10);

	switch (result){
		case 0:
			return "Gigantic ";
			break;
		case 1:
			return "Epic ";
			break;
		case 2:
			return "Cunning ";
			break;
		case 3:
			return "Flying ";
			break;
		case 4:
			return "Tasty ";
			break;
		case 5:
			return "Poisonous ";
			break;
		case 6:
			return "Sleepy ";
			break;
		case 7:
			return "Spontaneous ";
			break;
		case 8:
			return "Sneaky ";
			break;
		case 9:
			return "Tiny ";
			break;
	}
	return "Tired ";
};


setInterval(function(){ app.heartbeat() }, 20000);
















