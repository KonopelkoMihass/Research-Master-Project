// File: audio_manager.js
/* Line Length ruler.
----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|
         10        20        30        40        50        60        70        80        90        100
*/

/**
 * Stores and manages all the audio needed for the game.
 */
class AudioManager {
	constructor() {
		/** @private @let {!Array<!AudioBuffer>} */
		this.audioBuffers_ = [];
		/** @private @let {!Object<!AudioContext>} */
		this.audioConText_ = {};
		/** @private @let {!Array<!string>} */
		this.downLoadQueue_ = [];
		/** @private @let {!number} */
		this.errorCount_ = 0;
		/** @private @let {!Object<!AudioBuffer|string>} */
		this.playingSounds_ = {};  // Sounds that are currently playing
		/** @private @const {!string} */
		this.RESOURCE_PATH = 'resources/audio/';
		/** @private @let {!number} */
		this.successCount_ = 0;

		try {
			// Fix up for prefixing (don't have to write 'webkit' all the time)
			window.AudioContext = window.AudioContext||window.webkitAudioContext;
			this.audioContext_ = new AudioContext();
		} catch(e) {
			alert('Web Audio API is not supported in this browser');
		}  
	}

	// More methods. 
	
}