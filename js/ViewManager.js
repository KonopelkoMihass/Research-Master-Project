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
			if(this.views[i].title==title)
			{
				viewFound=true;
				this.nextView = this.views[i];
			}
			i++;
		}

		if(viewFound)
		{
			if(this.currentView!=undefined)
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
