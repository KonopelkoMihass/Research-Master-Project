class Robot {
	constructor(model) {
		/** @private @const {!string} */
		this.model_ = model;
		/** @private @let {!Vector2} */
		this.position_ = new Vector2 (0,0);
	}

	getPosition() {
		return this.position_;
	}
	
	set position(x, y) {
		this.position_.x = x;
		this.position_.y = y;
	}
}