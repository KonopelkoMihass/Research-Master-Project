// File: imagemanager.js
/* Line Length ruler.
----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|
         10        20        30        40        50        60        70        80        90        100
*/

/**
 * Stores all the assets needed for the game.
 */
class ImageManager() {
	constructor() {
	   	/** @private @let {!Cache} */
	    this.cache_ = {};
			/** @private @let {!DpwnloadQueue} */
	    this.downloadQueue_ = [];
			/** @private @let {!ErrorCount} */
	    this.errorCount_ = 0;		
			/** @private @const {!ResourcePath} */
	    this.resourcePath_ = "resources/images/";			
		  /** @private @let {!SuccessCount} */
	    this.successCount_ = 0;
	}

	/**
	 * Will queue an item to load later.
	 * @param filename - name and extension of an image,
	 */
	queueImage(filename) {
		this.downloadQueue.push(this.resourcePath_ + filename);
	}


	/**
	 * Starts and does a download.
	 * @param downloadCallback - a function to call when all images are 
	 * downloaded.
	 */
	downloadAll(downloadCallback) {
		for (let i = 0; i < this.downloadQueue_.length; i++) {
			let path = this.downloadQueue_[i];
			let img = new Image();
			let that = this;

			img.addEventListener("load", function() {
				that.successCount_ += 1;
				if (that.isDone()) downloadCallback();
			}, false);

			if (this.downloadQueue_.length === 0) downloadCallback();
			
			img.addEventListener("error", function() {
				that.errorCount_ += 1;
				if (that.isDone()) {
					downloadCallback();
				}
			}, false);

			img.src = path;
			let name = path.slice((this.resourcePath_).length);
			this.cache_[name] = img;
		}
	}

	/**
	 * Tells whenever it is done loading stuff.
	 * @returns {boolean} - whether or not the ImageManager has finished
   * downloading
	 * all the images.
	 */
	isDone() {
		console.log("ImageManager success count " 
			+ this.successCount_ + " / " 
			+ this.downloadQueue_.length + ' errors: '
			+ this.errorCount_);
		return (this.downloadQueue_.length == 
			this.successCount_ + this.errorCount_);
	}
	
	/**
	 * Gets an image.
	 * @param filename - a name and an extension of an image.
	 * @returns {image} - the image file which can be used.
	 */
	getImage(filename) {
		return this.cache_[filename];
	}
}