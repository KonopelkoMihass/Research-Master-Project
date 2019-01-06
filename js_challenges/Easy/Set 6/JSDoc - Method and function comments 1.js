class ImageManager {

	/**
	 * Will queue an item to load later.
	 * @param {string} filename Name and extension of an image.
	 */
	queueImage(filename) {
		// Inner logic.
	}


	/**
	 * Starts and does a download.
	 */
	downloadAll(downloadCallback) {
		// Inner logic.
	}

	/**
	 * Tells whenever it is done loading stuff.
	 */
	isDone() {
		// Inner logic.
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