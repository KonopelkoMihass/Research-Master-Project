// File: audio_manager.js
/* Line Length ruler.
----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|
         10        20        30        40        50        60        70        80        90        100
*/
class AudioManager {
	constructor() {
		/** @private @let {!AudioBuffers} */
		this.audioBuffers_ = [];
		/** @private @let {!AudioContext} */
		this.audioContext_ = {};
		/** @private @let {!Cache} */
		this.cache_ = {};
		/** @private @let {!DownloadQueue} */
		this.downloadQueue_ = [];
		/** @private @let {!ErrorCount} */
		this.errorCount_ = 0;
		/** @private @let {!PlayingSounds} */
		this.playingSounds_ = {};  // Sounds that are currently playing
		/** @private @const {!ResourcePath} */
		this.resourcePath_ = "resources/audio/";
		/** @private @let {!SuccessCount} */
		this.successCount_ = 0;

		try {
			// Fix up for prefixing (don't have to write "webkit" all the time)
			window.AudioContext = window.AudioContext || window.webkitAudioContext;
			this.audioContext_ = new AudioContext();
		} catch(e) alert('Web Audio API is not supported in this browser');
	}

	/**
	* Load the sound file.
	* @param filename - name to refer to sound.
	* @param downloadCallback - function to call.
	*/
	loadSoundFile(filename, downloadCallback) {
		let that = this;
		let url = this.resourcePath + filename;

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
				console.log("Sound was loaded.");
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

	// the rest of the file.

}