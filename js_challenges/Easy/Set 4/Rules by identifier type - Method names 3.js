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
		//Inner logic.
	}

	/** Setups the HTML related to this view. */
	setup() {
		// Inner logic.
	}
	
	/** Private method which sets display style. */
	setDisplay(value) {
		this.root.style.display = value;
	}
	
	/** Called when switching to this view. */
	show() {
		// if the view hasn't been initialised_, call setup.
		if (!this.initialised_) {
			this.setup();
		} else {

			this.setDisplay('block');
		}
	}

	/** Called when switching from this view. */
	hide() {
		this.setDisplay('none');
	}
}
