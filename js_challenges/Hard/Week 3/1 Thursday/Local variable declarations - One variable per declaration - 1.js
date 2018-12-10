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
		// some inner declarations
	}

	/**
	 * Load the sound file.
	 * @param {string) filename Name to refer to sound.
	 * @param {AudioManager~requestCallback} downloadCallback 
	 * 		Function to call.
	 */
	loadSoundFile(filename, downloadCallback) {
		let that = this, url = this.RESOURCE_PATH + filename;

		let xhr = new XMLHttpRequest();
		xhr.open('GET', url, true);
		xhr.responseType = 'arraybuffer';

		// More code here.
		
	}
}