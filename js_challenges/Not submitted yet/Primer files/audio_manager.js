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
			//buffer containing sound returned by xhr
			let arrayBuffer = this.response;
			that.audioContext_.decodeAudioData(arrayBuffer, function(buffer) {
				// associate the audio buffer with the sound name so can use the 
				// decoded audio later.
				that.audioBuffers_[filename] = buffer;
				console.log('Sound was loaded.');
				that.successCount_++;
				if (that.isDone()) {
					downloadCallback();
				}
			}, function(e) {
				that.errorCount_++;
				if (that.isDone()) {
					downloadCallback();
				}
				console.log('Error decoding file', e);
			});
		}
		//send the xhr request to download the sound file
		xhr.send();
	}

	/**
	 * Plays a sound.  startTime & duration are optional.
	 * @param {string} filename Name of a sound and extension.
	 * @param {number} startTime Time from where the sound is played.
	 * @param {number} duration For how long it plays a sound.
	 */
	playSound(filename, startTime, duration) {
		// No callback
		let callback = null;
		this.playSnippet(filename, null, startTime, duration);
	};

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
		source.buffer = audioBuffer;
		source.loop = false;

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
		this.playingSounds_[filename] = source;
	}

	/**
	 * Stops a sound.
	 * @param {string} filename Name and an extension of the sound to stop.
	 */
	stopPlayingSound(filename) {
		if (!this.playingSounds_[filename]) {
			return;
		} else {
			this.playingSounds_[filename].stop(0);
		}
	}

	/**
	 * Plays an empty sound.  This is for iOS (user needs to 
	 * interact e.g. touch a button which causes a sound to be 
	 * played in order to be able to play sounds without user interaction)
	 */
	playEmptySound() {
		// Create empty buffer
		// https://paulbakaus.com/tutorials/html5/web-audio-on-ios/
		let buffer = this.audioContext_.createBuffer(1, 1, 22050);
		let source = this.audioContext_.createBufferSource();
		source.buffer = buffer;
		source.connect(this.audioContext_.destination);

		// play the file
		source.start(0);
	}

	/**
	 * Queues a sound for downloading.
	 * @param {string} soundName Name and extension of a file to load.
	*/
	queueSound(soundName) {
		this.downloadQueue_.push(soundName);
	};

	/**
	 * Downloads all queued sounds.
	 * @param {AudioManager~requestCallback} downloadCallback
	 *    A callback function to call once download is complete.
	 */
	downloadAll(downloadCallback) {
		for (let i = 0; i < this.downloadQueue_.length; i++) {
			this.loadSoundFile(this.downloadQueue_[i], downloadCallback);
		}
	}

	/**
	 * Checks if the total success count and error count is equal 
	 * to total sounds to download.
	 * @returns {boolean} Whether or not the AudioManager 
	 *    has finished downloading all the sounds.
	 */
	isDone() {
		let result = this.successCount_ + ' / '  + this.downloadQueue_.length + 
				' errors: ' + this.errorCount_;
		
		console.log('AudioManager success count ' + result);
		return (this.downloadQueue_.length == this.successCount_ + this.errorCount_);
	} 
}