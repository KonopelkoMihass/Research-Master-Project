// File: image_manager.js
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
		let path = this.resourcePath_;
		if (path !== "") this.downloadQueue_.push(path + filename);
	}

	// rest of the file.
	
}