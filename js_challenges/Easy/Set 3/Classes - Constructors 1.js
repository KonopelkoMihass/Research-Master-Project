class Rectangle extends Shape
{
	constructor(position, width, height) {
		/** @private @const {!number} */
		this.width_ = width;
		/** @private @const {!number} */
		this.height_ = height;
		
		super('Rectangle', position);
		// More constructor logic.
	}
	
	// More code.
}