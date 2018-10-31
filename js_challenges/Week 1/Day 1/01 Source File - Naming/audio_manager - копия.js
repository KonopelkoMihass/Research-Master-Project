// File: Audio_Manager.js
/* Line Length ruler.
----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|
         10        20        30        40        50        60        70        80        90        100
*/
class AudioManager {
	constructor() {
		// logic
	}

	/**
	* Load the sound file.
	* @param filename - name to refer to sound.
	* @param downloadCallback - function to call.
	*/
	loadSoundFile(filename, downloadCallback) {
		// logic
	}
  
	/**
	 * Plays the list of sounds sequentially.
	 * param playlist - contains {name_of_sound, element name to display 
	 * when the sound finishes}
	 */
	playPlaylist(playList, callback) {
		// logic
	}

	/**
	 * Plays sound
	 * startTime and duration are optional
	 */
	/**
	 * Plays a sound.  startTime & duration are optional.
	 * @param filename - name of a sound and extension.
	 * @param startTime - from where it plays a sound.
	 * @param duration - for how long it plays a sound.
	 */
	playSound(filename, startTime, duration) {
		// logic
	};

	/**
	 * Plays sound if it has been loaded, otherwise does nothing.
	 * @param filename - a name and an extension of the sound to play.
	 * @param callback - opt: function to call when sound finishes playing.
	 * @param startTime - from where it plays a sound.
	 * @param duration - for how long it plays a sound.
	 */
	playSnippet(filename, callback, startTime, duration) {
		// logic
	}

	/**
	 * Stops a sound.
	 * @param filename - a name and an extension of the sound to stop.
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
	 * @param soundName - name and extension of a file to load.
	 */
	queueSound(soundName) {
		// logic
	};

	/**
	 * Downloads all queued sounds.
	 * @param downloadCallback - a function to call once download is complete.
	 */
	downloadAll(downloadCallback) {
		// logic
	}

	/**
	 * Checks if the total success count and error count is equal 
	 * to total sounds to download.
	 * @returns {boolean} - whether or not the AudioManager 
	 * has finished downloading all the sounds.
	 */
	isDone() {
		// logic
	} 
}