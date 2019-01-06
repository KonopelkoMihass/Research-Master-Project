
class Rectangle {
	/**
	 * Construct a rectangle with defined parameters.
	 */
	constructor(
			/** number */ x, 
			/** number */ y, 
			/** number */ width, 
			/** number */ height) {
		this.position_ = new Vector2(x, y);
		this.width_ = width;
		this.height_ = height;
	}

	/**
	 * Sets the new position of the rectangle
	 * @param {number} x defines top-left x position.
	 */
	setCenter(x, /** number */ y) {
		this.position_ = new Vector2(x, y);
	}
}