class View {
	constructor(title) {
		//has the scene been initialised?
		//e.g. ensure you only add event listeners once
		/** @private @let {!boolean} */
		this.initialised_ = false;
		/** @let {!Scene} */
		this.nextScene_ = undefined;
		/** @private @const {!string} */
		this.TITLE = title;
	}
}
