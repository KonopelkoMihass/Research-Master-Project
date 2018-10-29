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
    // Count successes and fails regarding download.
    this.successCount = 0;
    this.errorCount = 0;

    this.resourcePath = "resources/images/";

    this.cache = {};
    this.downloadQueue = [];
	}

	/**
	 * Will queue an item to load later.
	 * @param filename - name and extension of an image,
	 */
	queueImage(filename) {
		this.downloadQueue.push(this.resourcePath+filename);
	};


	/**
	 * Starts and does a download.
	 * @param downloadCallback - a function to call when all images are 
	 * downloaded.
	 */
	downloadAll(downloadCallback) {
		for (var i = 0; i < this.downloadQueue.length; i++) {
			var path = this.downloadQueue[i];
			var img = new Image();
			var that = this;

			img.addEventListener("load", function() {
				that.successCount += 1;
				if (that.isDone()) {
					downloadCallback();
				}
			}, false);


			if (this.downloadQueue.length === 0) {
				downloadCallback();
			}

			img.addEventListener("error", function() {
				that.errorCount += 1;
				if (that.isDone()) {
					downloadCallback();
				}
			}, false);

			img.src = path;
			var name = path.slice((this.resourcePath).length);
			this.cache[name] = img;
		}
	};

	/**
	 * Tells whenever it is done loading stuff.
	 * @returns {boolean} - whether or not the ImageManager has finished
   * downloading
	 * all the images.
	 */
	isDone() {
		console.log("ImageManager success count " 
			+ this.successCount + " / " 
			+ this.downloadQueue.length + ' errors: '
			+ this.errorCount);
		return (this.downloadQueue.length == this.successCount + this.errorCount);
	};

	/**
	 * Gets an image.
	 * @param filename - a name and an extension of an image.
	 * @returns {image} - the image file which can be used.
	 */
	getImage (filename) {
		var image = this.cache[filename];
		return image;
	}
}