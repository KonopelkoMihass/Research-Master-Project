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
		this.audioContext_ = {};
		/** @private @let {!Array<!string>} */
		this.downloadQueue_ = [];
		/** @private @let {!number} */
		this.errorCount_ = 0;
		/** @private @let {!Object<!AudioBuffer|string>} */
		this.playingSounds_ = {};  // Sounds that are currently playing
		/** @private @const {!string} */
		this.resourcePath_ = "resources/audio/";
		/** @private @let {!number} */
		this.successCount_ = 0;

		try {
			// Fix up for prefixing (don't have to write "webkit" all the time)
			window.AudioContext = window.AudioContext||window.webkitAudioContext;
			this.audioContext_ = new AudioContext();
		} catch(e) {
			alert('Web Audio API is not supported in this browser');
		}  
	}

	// some code

	/**
	 * Plays sound if it has been loaded, otherwise does nothing.
	 * @param {string} filename Name and an extension of the sound to play.
	 * @param {AudioManager~requestCallback} callback (optionl) 
	 *    Function to call when sound finishes playing.
	 * @param {number} startTime Time from where it plays a sound.
	 * @param {number} duration For how long it plays a sound.
	*/
	playSnippet(filename, callback, startTime, duration) {
		if (this.audioBuffers_[filename] == undefined) {
			return;
		}

		// Retrieve the buffer we stored earlier
		let audioBuffer = this.audioBuffers_[filename];

		// Create a buffer source - used to play once and then 
		// a new one must be made
		let source = this.audioContext_.createBufferSource();
		source.buffer = audioBuffer; source.loop = false;

		// Connect to your speakers
		source.connect(this.audioContext_.destination);

		if(callback != undefined) {
			source.onended = callback;
		}

		if(startTime != undefined) {
			if(duration != undefined) {
				source.start(0, startTime, duration);
			}	else {
				source.start(0, startTime);
			}
		}	else {
			source.start(0); // Play immideately.
		}
		this.playingSounds_[name] = source;
	}

	// more code
	
}