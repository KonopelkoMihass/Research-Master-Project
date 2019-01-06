// a method from an ImageManager class.
/**
 * Will queue an item to load later.
 * @param {string} filename Name and extension of an image.
 */
queueImage(filename) {
	let path = this.resourcePath_;
	let filepath = path + filename;
	if (path !== "") 
		this.downloadQueue_.push(filepath);
}


