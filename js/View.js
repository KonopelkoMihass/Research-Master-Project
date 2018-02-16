/**Superclass that other views can inherit from**/
class View
{
	constructor(title)
	{
		this.title = title;

		this.nextScene = undefined;

		//has the scene been initialised?
		//e.g. ensure you only add event listeners once
		this.initialised=false;
	}

	setup ()
	{
		//add root element for this view
		if(this.title === undefined)
		{
			console.error("Trying to use a view that doesn't exist.  Check the this.title in your views exist in ViewManager.VIEW");
		}
		else
		{
			this.root = document.getElementById(this.title);
		}

		//hide the view initially
		this.hide();

		//initialised
		this.initialised=true;
	}

	/**Called when switching to this view**/
	show ()
	{
		//if the view hasn't been initialised, call setup (of the concrete view e.g. LOView)
		if(!this.initialised)
		{
			this.setup();
		}
		else
		{
			//unhide the elements of the scene
			this.root.style.display = 'block';
		}
	}

	/**Called when switching from this view**/
	hide ()
	{
		//hide the elements of the view
		this.root.style.display= 'none';
	}
}
