// File: view.js
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

	// Add code to it.
	 /** Setups the HTML related to this view. **/
	setup() {}

	// Add code to it.
	/**Called when switching to this view**/
	show() {}
	
	// Add code to it.
	/**Called when switching from this view**/
	hide() {
	}
}
