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
		// Some code logic.
	}

	// More code.

	/**
	 * Tells whenever it is done loading stuff.
	 * @returns {boolean} - whether or not the ImageManager has finished
	 *    downloading all the images.
	 */
	isDone() {
		let result = this.successCount_ + " / "  + this.downloadQueue_.length 
				+ ' errors: ' + this.errorCount_
		console.log("ImageManager success count " + result);
		return (this.downloadQueue_.length == this.successCount_ + this.errorCount_);
	}

	/**
	 * Gets an image.
	 * @param {string} filename Name and an extension of an image.
	 * @returns {Image} The image file which can be used.
	 */
	getImage(filename) {
		return this.cache_[filename];
	}
}