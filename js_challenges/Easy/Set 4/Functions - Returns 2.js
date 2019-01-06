// Methods for the rectangle.
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
	
	/**
	 * Gets the position of a rectangle shape.
	 */
	getPosition() {
		return this.position_;
	}