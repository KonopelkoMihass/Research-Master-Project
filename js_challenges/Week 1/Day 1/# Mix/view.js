// File: View.js
/* Line Length ruler.
----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|
         10        20        30        40        50        60        70        80        90        100
*/

/**
  Superclass that other views can inherit from.
**/
class View {
	constructor(title) {
		//has the scene been initialised?
		//e.g. ensure you only add event listeners once
		/** @private @let {!Initialised} */
		this.initialised_ = false;
		/** @private @let {!NextScene} */
		this.nextScene_ = undefined;
		/** @private @let {!Title} */
		this.title_ = title;
	}

	 /** Setups the HTML related to this view. **/
	setup() {
		//add root element for this view
		if (this.title_ === undefined) {
			console.error("Trying to use a view that doesn't exist");
		} else {
			this.root = document.getElementById(this.title_);
		}

		//hide the view initially
		this.hide();

		//initialised
		this.initialised_ = true;
	}

	/**Called when switching to this view**/
	show() 
	{
		if (!this.initialised_) this.setup();
		else this.root.style.display = 'block';	
	}

	/**Called when switching from this view**/
	hide() { this.root.style.display = 'none'; }
}
