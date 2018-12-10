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
		// logic
	}

	// some code logic
	
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
		source.connect(this.audioContext_.destination); source.start(0);
	}

	// more code.
	
}