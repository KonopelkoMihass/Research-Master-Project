class AudioManager {
	constructor() {
		/** @private @let {!Array<!AudioBuffer>} */
		this.audioBuffers_ = [];
		/** @private @let {!Object<!AudioContext>} */
		this.audioContext_ = {};
	
		// More constructor.
	}
	
	playSound(filename, startTime, duration) {	
		this.loadedSounds = true;
		// No callback
		let callback = null;
		this.playSnippet(filename, null, startTime, duration);
	}
}