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
		/** @private @let {!Object<string, !Image>} */
		this.cache_ = {};
		/** @private @let {!Array<!string>} */
		this.downloadQueue_ = [];
		/** @private @let {!number} */
		this.errorCount_ = 0;		
		/** @private @const {!string} */
		this.RESOURCE_PATH = 'resources/images/';			
		/** @private @let {!number} */
		this.successCount_ = 0;
	}

	/**
	 * Will queue an item to load later.
	 * @param {string} filename Name and extension of an image.
	 */
	queueImage(filename) {
		this.downloadQueue_.push(this.RESOURCE_PATH+filename);
	}


	/**
	 * Starts and does a download.
	 * @param {ImageManager~requestCallback} downloadCallback  
	 *    A function to call when all images are downloaded.
	 */
	downloadAll(downloadCallback) {
		for (let i = 0; i < this.downloadQueue_.length; i++) {
			let path = this.downloadQueue_[i];
			let img = new Image();
			let that = this;

			img.addEventListener('load', function() {
				that.successCount_ += 1;
				if (that.isDone()) {
					downloadCallback();
				}
			}, false);

			if (this.downloadQueue_.length === 0) {
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
	 */
	isDone() {
		let result = this.successCount_ + ' / '  + this.downloadQueue_.length + 
				' errors: ' + this.errorCount_
		console.log('ImageManager success count ' + result);
		return (this.downloadQueue_.length == this.successCount_ + this.errorCount_);
	}

	/**
	 * Gets an image.
	 * @param {string} filename Name and an extension of an image.
	 */
	getImage(filename) {
		return this.cache_[filename];
	}
}