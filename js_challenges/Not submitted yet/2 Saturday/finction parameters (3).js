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
		// Constructor Logic.
	}

	/**
	 * Load the sound file.
	 */
	loadSoundFile(filename, downloadCallback) {
		let that = this;
		let url = this.RESOURCE_PATH + filename;

		let xhr = new XMLHttpRequest();
		xhr.open('GET', url, true);
		xhr.responseType = 'arraybuffer';

		xhr.onload = function(e) {
			// some logic.
		}
		//send the xhr request to download the sound file
		xhr.send();
	}

	/**
	 * Plays a sound.  startTime & duration are optional.
	 */
	playSound(filename, startTime, duration) {
		// No callback
		let callback = null;
		this.playSnippet(filename, null, startTime, duration);
	};

	// More Code
	
}