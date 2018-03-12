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
			CODE_VIEW:"code-view"
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
				console.log("Change view from:", this.currentView.title);
				this.currentView.hide();
			}

			this.currentView = this.nextView;
			console.log("Change view to:", this.currentView.title);
			this.currentView.show();
		}
		else
		{
			console.log("View not found:", title);
		}
	}
}
