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
		/** @private @let {!Scene} */
		this.nextScene_ = undefined;
		/** @private @const {!string} */
		this.TITLE = title;
	}

	/** Setups the HTML related to this view. */
	setup() {
		//add root element for this view
		if (this.TITLE === undefined) {
			console.error('Trying to use a view that doesn\'t exist. ' + 
					'Check the this.TITLE in your views exist in ViewManager.View');
		} else {
			this.root = document.getElementById(this.TITLE);
		}

		//hide the view initially
		this.hide();

		//initialised_
		this.initialised_ = true;
	}

	// More code.
}
