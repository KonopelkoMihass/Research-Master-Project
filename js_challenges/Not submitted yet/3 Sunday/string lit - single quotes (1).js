// File: image_manager.js
/* Line Length ruler.
----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|
         10        20        30        40        50        60        70        80        90        100
*/

/**
 * Stores all the assets needed for the game.
 */
class ImageManager {
	constructor() {
		// Inner Logic.
	}
	
	// Many methods.

	isDone() {
		let result = this.successCount_ + " / "  + this.downloadQueue_.length + 
				' errors: ' + this.errorCount_;
		console.log("ImageManager success count " + result);
		return (this.downloadQueue_.length == this.successCount_ + this.errorCount_);
	}

	// A bit more.
	
}