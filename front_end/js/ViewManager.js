/**Keeps track of views, add views, switch to a given view.
* @constructor**/
class ViewManager
{
	constructor()
	{
		this.views=[];
		this.currentView = undefined;

		this.VIEW = {
			SIGNIN: "signin",
			SIGNUP: "signup",
			PROFILE: "profile",
			ASSIGNMENTS_TEACHER: "assignments-teacher",
			ASSIGNMENTS_STUDENT: "assignments-student",
			FEEDBACK: "feedback",
			PERFORM_REVIEW_STUDENT: "perform-review-student",
			SEE_SUBMISSIONS_STUDENT: "see-submissions-student",
			SEE_SUBMISSIONS_TEACHER: "see-submissions-teacher",
			SEE_STANDARDS_STUDENT: "see-standards-student",
			SEE_STANDARDS_TEACHER: "see-standards-teacher",
			CODE_VIEW:"code-view",
			CREATE_CHALLENGE:"create-challenge",
			CHALLENGE: "challenge",
			MANAGE_SYSTEMS_TEACHER: "manage-systems-teacher",
			STUDENT_SYSTEM_SELECT: "student-system-select",
            CHANGE_PASSWORD:"change-password"
		}
	}

	/**@param {View} view**/
	addView (view)
	{
		this.views.push(view);
	}

	/**@param {string} title**/
	goToView (title)
	{
		var viewManager = this;

		var viewFound=false;
		var i=0;

		while(i < this.views.length && !viewFound)
		{
			if(this.views[i].title===title)
			{
				viewFound=true;
				this.nextView = this.views[i];
			}
			i++;
		}

		if(viewFound)
		{
			if(this.currentView!==undefined)
			{
				this.currentView.hide();
				app.annalist.trackViewChanges(viewManager.currentView.title, viewManager.nextView.title);
			}

			this.currentView = this.nextView;

			this.currentView.show();
		}
		else
		{
			//console.error("View not found:", title);
		}
	}


}
