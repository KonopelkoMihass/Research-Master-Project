// File: rectangle.js
/* Line Length ruler.
----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|
         10        20        30        40        50        60        70        80        90        100
*/

/**
 * Collection of data to refer to a rectangle
 * @class
 * @classdesc Defines a rectangles position and size.
 */
class Rectangle {
	/**
	 * Construct a rectangle with defined parameters.
	 * @param {number} x defines top-left x position 
	 * in the game world.
	 * @param {number} y defines top-left y position
	 * in the game world.
	 * @param {number} width defines width along x-axis
	 * in the game world.
	 * @param {number} height defines height along y-axis
	 * in the game world.
	 */
	constructor(x, y, width, height) {
		/** @private @let {!Vector2} */
		this.position_ = new Vector2(x, y);
		/** @private @let {!number} */
		this.width_ = width;
		/** @private @let {!number} */
		this.height_ = height;
	}

	/**
	 * Gets the center of a rectangle shape.
	 * @returns {Vector2} returns 
	 *    the center position of the rectangle.
	 */
	getCenter() {
		return new Vector2(
				this.position_.x + (this.width_ / 2), 
				this.position_.y + (this.height_/ 2)
		);
	}
}