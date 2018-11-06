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

	/**
	 * Load the sound file.
	 * @param {string) filename Name to refer to sound.
	 * @param {AudioManager~requestCallback} downloadCallback 
	 *    Function to call.
	 */
	loadSoundFile(filename, downloadCallback) {
		// logic
	}

	/**
	 * Plays a sound.  startTime & duration are optional.
	 * @param {string} filename Name of a sound and extension.
	 * @param {number} startTime Time from where the sound is played.
	 * @param {number} duration For how long it plays a sound.
	 */
	playSound(filename, startTime, duration) {
		// logic
	}

	/**
	 * Plays sound if it has been loaded, otherwise does nothing.
	 * @param {string} filename Name and an extension of the sound to play.
	 * @param {AudioManager~requestCallback} callback (optionl) 
	 *    Function to call when sound finishes playing.
	 * @param {number} startTime Time from where it plays a sound.
	 * @param {number} duration For how long it plays a sound.
	 */
	playSnippet(filename, callback, startTime, duration) {
		// logic
	}

	/**
	 * Stops a sound.
	 * @param {string} filename Name and an extension of the sound to stop.
	 */
	stopPlayingSound(filename) {
		// logic
	}

	/**
	 * Plays an empty sound.  This is for iOS (user needs to 
	 * interact e.g. touch a button which causes a sound to be 
	 * played in order to be able to play sounds without user interaction)
	 */
	playEmptySound() {
		// logic
	}

	/**
	 * Queues a sound for downloading.
	 * @param {string} soundName Name and extension of a file to load.
	 */
	queueSound(soundName) {
		// logic
	}

	/**
	 * Downloads all queued sounds.
	 * @param {AudioManager~requestCallback} downloadCallback
	 *    A callback function to call once download is complete.
	 */
	downloadAll(downloadCallback) {
		// logic
	}

	/**
	 * Checks if the total success count and error count is equal 
	 * to total sounds to download.
	 * @returns {boolean} whether or not the AudioManager 
	 *    has finished downloading all the sounds.
	 */
	isDone() {
		// logic
	} 
}