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
		// Some code.
	}

	/**
	 * Will queue an item to load later.
	 * @param {string} filename Name and extension of an image.
	 */
	queueImage(filename) {
		this.downloadQueue_.push(this.RESOURCE_PATH + filename);
	}

	/**
	 * Starts and does a download.
	 * @param {ImageManager~requestCallback} downloadCallback  
	 *    A function to call when all images are downloaded.
	 */
	downloadAll(downloadCallback) {
		for(let i = 0; i < this.downloadQueue_.length; i++) {
			let path = this.downloadQueue_[i];
			let img = new Image();
			let that = this;

			img.addEventListener('load', function() {
				that.successCount_ += 1;
				if (that.isDone()) {
					downloadCallback();
				}
			}, false);

			if(this.downloadQueue_.length === 0) {
				downloadCallback();
			}

			img.addEventListener('error', function() {
				that.errorCount_ += 1;
				if (that.isDone()) {
					downloadCallback();
				}
			}, false);

			img.src = path;
			let name = path.slice((this.RESOURCE_PATH).length);
			this.cache_[name] = img;
		}
	}

	/**
	 * Tells whenever it is done loading stuff.
	 * @returns {boolean} - whether or not the ImageManager has finished
	 *    downloading all the images.
	 */
	isDone() {
		let result = this.successCount_ + ' / '  + this.downloadQueue_.length + 
				' errors: ' + this.errorCount_;
		console.log('ImageManager success count ' + result);
		return (this.downloadQueue_.length == this.successCount_ + this.errorCount_);
	}
	
	// Some code.
	
}	