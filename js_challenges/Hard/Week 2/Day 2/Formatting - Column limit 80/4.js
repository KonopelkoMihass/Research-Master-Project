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
		// some logic.
	}

	// some code.

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
	 * @param {AudioManager~requestCallback} callback (optional) 
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

		// Create a buffer source - used to play sound once.  Then a new one must be created.
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
		this.playingSounds_[name] = source;
	}

	/**
	 * Stops a sound.
	 * @param {string} filename Name and an extension of the sound to stop.
	 */
	stopPlayingSound(filename) {
		if (!this.playingSounds_[name]) {
			return;
		} else {
			this.playingSounds_[name].stop(0);
		}
	}

	/**
	 * Plays an empty sound.  This is for iOS (user needs to  interact e.g. 
	 * touch a button which causes a sound to be played in order to be able to play sounds 
	 without user interaction)
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

	// more code.
	
}