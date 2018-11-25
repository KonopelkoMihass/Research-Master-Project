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
		// Irrelevant logic.
	}

	// Some method.

	/**
	 * Plays a sound.  startTime & duration are optional.
	 * @param {string} filename Name of a sound and extension.
	 * @param {number} startTime Time from where the sound is played.
	 * @param {number} duration For how long it plays a sound.
	 */
	playSound(filename, start_time, duration) {
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
	playSnippet(filename, callback, start_time, duration) {
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

	// More of the methods.
	
}