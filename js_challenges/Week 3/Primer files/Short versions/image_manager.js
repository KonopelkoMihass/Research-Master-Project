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
		// logic
	}

	/**
	 * Will queue an item to load later.
	 * @param {string} filename Name and extension of an image.
	 */
	queueImage(filename) {
		// logic
	}

	/**
	 * Starts and does a download.
	 * @param {ImageManager~requestCallback} downloadCallback  
	 *    A function to call when all images are downloaded. 
	 */
	downloadAll(downloadCallback) {
		// logic
	}

	/**
	 * Tells whenever it is done loading stuff.
	 * @returns {boolean} Whether or not the ImageManager has finished
	 *    downloading all the images.
	 */
	isDone() {
		// logic
	}

	/**
	 * Gets an image.
	 * @param {string} filename Name and an extension of an image.
	 * @returns {Image} The image file which can be used.
	 */
	getImage(filename) {
		// logic
	}
}