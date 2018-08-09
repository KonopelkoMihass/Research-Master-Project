var app;

window.onbeforeunload = function()
{
	app.tracker.sendAndClearLogs(true);
};

function main()
{
	app = new App();
}


class App
{
 	constructor()
 	{
		this.net = new Net();
		this.urlChecker = new URLChecker();
		this.cookieManager = new CookieManager();

		this.audioManager = new AudioManager();

		this.viewManager= new ViewManager();
		this.templateManager = new TemplateManager();
		this.modalContentManager = new ModalContentManager();
		this.uiFactory = new UIFactory();
		this.tracker =  new Tracker(this.net);

		//load views
		for (var viewName in this.viewManager.VIEW)
		{
			console.log(this.viewManager.VIEW[viewName]);
			this.templateManager.queueTemplate(this.viewManager.VIEW[viewName]);
		}

		//load resources
		this.loadResources();
		this.audioManager.downloadAll(function() {
			app.templateManager.downloadAll(function()	{
				app.modalContentManager.downloadAll(function () {
					app.setup();
					app.tracker.updateTracks();
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
		this.challenge = new Challenge();

		this.net.setHost(location.hostname, 80); // replace with 80 when putting on gamecore
		this.net.connect();

		this.urlChecker.setHost(location.hostname, 80);

		this.setupViews();
		this.setupMenuPanel();

		this.trySignInImmediately();
	}

	trySignInImmediately()
	{
		var signedInData = this.cookieManager.getCookie("SignInCR2");

        if (Object.keys(signedInData).length === 0)
        {
            this.viewManager.goToView("signin");
        }

        else
		{
			var email = signedInData.email;
			var password = signedInData.password;
			setTimeout(function()
			{
				//needed as it sets a first view and a view manager as it is.
				app.viewManager.goToView("signin");
				app.user.signin(email, password);
			}, 100);
		}

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

		var createChallengeController = new CreateChallengeController(this.challenge);
		var createChallengeView = new CreateChallengeView(createChallengeController);
		this.viewManager.addView(createChallengeView);

		var challengeController = new ChallengeController(this.challenge);
		var challengeView = new ChallengeView(challengeController);
		this.viewManager.addView(challengeView);



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

		// Student - Standards
		this.standards.addObserver(seeStandardsStudentView, this.net.messageHandler.types.GET_STANDARD_SUCCESSFUL);

		// Student - Challenge
		this.challenge.addObserver(challengeView, this.net.messageHandler.types.GET_CHALLENGE_SUCCESSFUL);



	}

	setupMenuPanel()
	{
		var viewLabel = document.getElementById("view-title");

		app.uiFactory.assignFuncToButtonViaID("mps-profile-button", function() {
			if (app.viewManager.currentView.title !== app.viewManager.VIEW.PROFILE)
			{
				app.viewManager.goToView(app.viewManager.VIEW.PROFILE);
				viewLabel.innerText = "Your Profile";
			}
		});

		app.uiFactory.assignFuncToButtonViaID("mps-challenges-button", function() {
			if (app.viewManager.currentView.title !== app.viewManager.VIEW.CHALLENGE)
			{
				app.challenge.getChallenge();
			}
		});

		app.uiFactory.assignFuncToButtonViaID("mps-assignments-button", function() {
			if (app.viewManager.currentView.title !== app.viewManager.VIEW.ASSIGNMENTS_STUDENT)
			{
				app.viewManager.goToView(app.viewManager.VIEW.ASSIGNMENTS_STUDENT);
				document.getElementById("view-title").innerText = "Assignments";
			}
		});

		app.uiFactory.assignFuncToButtonViaID("mps-standards-button", function() {
			if (app.viewManager.currentView.title !== app.viewManager.VIEW.SEE_STANDARDS_STUDENT)
			{
				app.viewManager.goToView(app.viewManager.VIEW.SEE_STANDARDS_STUDENT);
				viewLabel.innerText = "Standards Available";
			}
		});

		app.uiFactory.assignFuncToButtonViaID("mps-reviews-button", function() {
			if (app.viewManager.currentView.title !== app.viewManager.VIEW.PERFORM_REVIEW_STUDENT)
			{
				app.viewManager.goToView(app.viewManager.VIEW.PERFORM_REVIEW_STUDENT);
				viewLabel.innerText = "Reviews To Do";
			}
		});

		app.uiFactory.assignFuncToButtonViaID("mpt-signout-button",function(){app.user.signout();});


		app.uiFactory.assignFuncToButtonViaID("mps-feedback-button", function() {
			if (app.viewManager.currentView.title !== app.viewManager.VIEW.FEEDBACK)
			{
				app.viewManager.goToView(app.viewManager.VIEW.FEEDBACK);
				viewLabel.innerText = "Feedback You Received";
			}
		});

		app.uiFactory.assignFuncToButtonViaID("mps-submissions-button", function() {
			if (app.viewManager.currentView.title !== app.viewManager.VIEW.SEE_SUBMISSIONS_STUDENT)
			{
				app.viewManager.goToView(app.viewManager.VIEW.SEE_SUBMISSIONS_STUDENT);
				viewLabel.innerText = "Your Submissions";
			}
		});



		app.uiFactory.assignFuncToButtonViaID("mpt-assignments-button", function() {
			if (app.viewManager.currentView.title !== app.viewManager.VIEW.ASSIGNMENTS_TEACHER)
			{
				app.viewManager.goToView(app.viewManager.VIEW.ASSIGNMENTS_TEACHER);
				viewLabel.innerText = "Assignments";
			}
		});

		app.uiFactory.assignFuncToButtonViaID("mpt-challenges-button", function() {
			if (app.viewManager.currentView.title !== app.viewManager.VIEW.CREATE_CHALLENGE)
			{
				app.viewManager.goToView(app.viewManager.VIEW.CREATE_CHALLENGE);
			}
		});

		app.uiFactory.assignFuncToButtonViaID("mpt-standards-button", function() {
			if (app.viewManager.currentView.title !== app.viewManager.VIEW.SEE_STANDARDS_TEACHER)
			{
				app.viewManager.goToView(app.viewManager.VIEW.SEE_STANDARDS_TEACHER);
				viewLabel.innerText = "Standards Available";
			}
		});

		app.uiFactory.assignFuncToButtonViaID("mpt-submissions-button", function() {
			if (app.viewManager.currentView.title !== app.viewManager.VIEW.SEE_SUBMISSIONS_TEACHER)
			{
				app.viewManager.goToView(app.viewManager.VIEW.SEE_SUBMISSIONS_TEACHER);
				viewLabel.innerText = "Student's Submissions";
			}
		});

		app.uiFactory.assignFuncToButtonViaID("mps-signout-button",function(){app.user.signout();});
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


setInterval(function()
{
	app.tracker.sendAndClearLogs(false);
	app.heartbeat()
}, 20000);
