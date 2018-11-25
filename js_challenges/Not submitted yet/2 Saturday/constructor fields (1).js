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
		/** @private @const {!number} */
		this.errorCount_ = 0;
		/** @private @let {!Object<!AudioBuffer|string>} */
		this.playingSounds_ = {};  // Sounds that are currently playing
		/** @private @const {!string} */
		this.RESOURCE_PATH = 'resources/audio/';
		/** @private @const {!number} */
		this.successCount_ = 0;

		try {
			// Fix up for prefixing (don't have to write 'webkit' all the time)
			window.AudioContext = window.AudioContext||window.webkitAudioContext;
			this.audioContext_ = new AudioContext();
		} catch(e) {
			alert('Web Audio API is not supported in this browser');
		}  
	}

	/**
	 * Load the sound file.
	 * @param {string} filename Name to refer to sound.
	 * @param {AudioManager~requestCallback} downloadCallback 
	 * 		Function to call.
	 */
	loadSoundFile(filename, downloadCallback) {
		let that = this;
		let url = this.RESOURCE_PATH + filename;

		let xhr = new XMLHttpRequest();
		xhr.open('GET', url, true);
		xhr.responseType = 'arraybuffer';

		xhr.onload = function(e) {
			// Inner logic.
		}
		//send the xhr request to download the sound file
		xhr.send();
		
		this.loadedSounds = true;
	}
}