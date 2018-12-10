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
		//has the scene been initialised?
		//e.g. ensure you only add event listeners once
		/** @private @let {!boolean} */
		this.initialised_ = false;
		/** @private @let {!Scene} */
		this.nxtScn_ = undefined;
		/** @private @const {!string} */
		this.TITLE = title;
	}

	// More code.
}
