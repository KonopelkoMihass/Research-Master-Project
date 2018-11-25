


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
	 * Construct a rectangle,
	 * with defined parameters.
	 * @param {number} x defines top-left x position.
	 * @param {number} y defines top-left y position.
	 * @param {number} width defines width along x-axis.
	 * @param {number} height defines height along y-axis.
	 */
	constructor(x, y, width, height) {
		/** @private @let {!Vector2} */
		this.p_ = new Vector2(x, y);
		/** @private @let {!number} */
		this.w_ = width;
		/** @private @let {!number} */
		this.h_ = height;
	}

	// More code.
}