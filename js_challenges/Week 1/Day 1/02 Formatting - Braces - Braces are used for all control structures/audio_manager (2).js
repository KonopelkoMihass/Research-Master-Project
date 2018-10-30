// File: audio_manager.js
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
		let that = this; 
		let sounds = [];
		let currentSound = 0;

		for (let [key, value] of playList) sounds.push(key);
		
		function next() {
			currentSound++;
			if(currentSound < sounds.length) {
				that.playSnippet(sounds[currentSound], next);
				//show picture then show sound
				var elementToDisplay = playList.get(sounds[currentSound]);
				if(elementToDisplay != undefined) {
					app.viewManager.showElement(elementToDisplay);
				}
			}	else {
				if(callback != undefined) callback();
			}
		}
		this.playSnippet(sounds[currentSound], next);
	}

	// Rest of the file.
}