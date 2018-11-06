// File: audio_manager.js
/* Line Length ruler.
----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|
         10        20        30        40        50        60        70        80        90        100
*/

/** Stores and manages all the audio needed for the game. */
class AudioManager {
	constructor() {
		/** @private @let {!Array<!AudioBuffer>} */
		this.audioBuffers_ = [];
		/** @private @let {!Object<!AudioContext>} */
		this.audioContext_ = {}
		/** @private @let {!Array<!string>} */
		this.downloadQueue_ = [];
		/** @private @let {!number} */
		this.errorCount_ = 0;
		/** @private @let {!Object<!AudioBuffer|string>} */
		this.playingSounds_ = {}  // Sounds that are currently playing
		/** @private @const {!string} */
		this.resourcePath_ = "resources/audio/";
		/** @private @let {!number} */
		this.successCount_ = 0;

		try {
			// Fix up for prefixing (don't have to write "webkit" all the time)
			window.AudioContext = window.AudioContext||window.webkitAudioContext;
			this.audioContext_ = new AudioContext();
		} catch(e) {alert('Web Audio API is not supported in this browser'); }  
	}

	// some code logic

	/**
	 * Checks if the total success count and error count is equal to total sounds to download.
	 * @returns {boolean} Whether or not the AudioManager 
	 *    has finished downloading all the sounds.
	 */
	isDone() {
		let result = this.successCount_ + " / "  + this.downloadQueue_.length + ' errors: ' + this.errorCount_
		console.log("AudioManager success count " + result);
		return (this.downloadQueue_.length == this.successCount_ + this.errorCount_);
	} 
};