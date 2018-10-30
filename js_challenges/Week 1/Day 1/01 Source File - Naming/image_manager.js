// File: ImageManager.js
/* Line Length ruler.
----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|
         10        20        30        40        50        60        70        80        90        100
*/


/**
 * Stores all the assets needed for the game.
 */
class ImageManager() {
	constructor() {
		// logic
	}

	/**
	 * Will queue an item to load later.
	 * @param filename - name and extension of an image,
	 */
	queueImage(filename) {
		// logic
	}


	/**
	 * Starts and does a download.
	 * @param downloadCallback - a function to call when all images are 
	 * downloaded.
	 */
	downloadAll(downloadCallback) {
		// logic
	}

	/**
	 * Tells whenever it is done loading stuff.
	 * @returns {boolean} - whether or not the ImageManager has finished
   * downloading
	 * all the images.
	 */
	isDone() {
		// logic
	}

	/**
	 * Gets an image.
	 * @param filename - a name and an extension of an image.
	 * @returns {image} - the image file which can be used.
	 */
	getImage(filename) {
		// logic
	}
}