// File: view.js
/* Line Length ruler.
----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|
         10        20        30        40        50        60        70        80        90        100
*/

/**
 * Superclass that other views can inherit from.
 */
class View {
	constructor(title) {
		// logic within
	}

	/** Setups the HTML related to this view. **/
	setup() {
		//add root element for this view
		if (this.title_ === undefined) {
		console.error("Trying to use a view that doesn't exist. " + 
				"Check the this.title_ in your views exist in ViewManager.VIEW");
		} else {
			this.root = document.getElementById(this.title_);
		}

		//hide the view initially
		this.hide();

		//initialised_
		this.initialised_ = true;
	}

	// more code
	
}
