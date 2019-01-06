// Methods for Audio Manager.

/**
 * Tells whenever it is done loading stuff.
 */
isDone() {
	let result = 
			this.successCount_ + ' / '  + this.downloadQueue_.length + 
			' errors: ' + this.errorCount_;
	console.log('ImageManager success count ' + result);
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
