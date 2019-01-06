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
		/** @public @let {!Vector2} */
		this.position = new Vector2(x, y);
		
		/** @private @let {!number} */
		this.width_ = width;
		
		/** @private @let {!number} */
		this.height_ = height;
	}

}