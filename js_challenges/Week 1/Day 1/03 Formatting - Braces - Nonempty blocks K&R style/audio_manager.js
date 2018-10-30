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
			window.AudioContext = window.AudioContext||window.webkitAudioContext;
			this.audioContext_ = new AudioContext();
		} catch(e) { alert('Web Audio API is not supported in this browser'); }  
	}

	// Rest of the file

}