/**
 * Stores and manages all the audio needed for the game.
 */
class AudioManager {
	constructor() {
		/** @private @let {!Array<!AudioBuffer>} */
		this.audioBuffers = [];
		
		/** @private @let {!Object<!AudioContext>} */
		this.audioContext = {};
		
		/** @private @let {!Array<!string>} */
		this.DownloadQueue_ = [];
		
		/** @let {!number} */
		this.errorCount_ = 0;
		
		/** @private @let {!Object<!AudioBuffer|string>} */
		this.playingSounds = {};  // Sounds that are currently playing
		
		/** @private @const {!string} */
		this.RESOURCE_PATH = 'resources/audio/';
		
		/** @let {!number} */
		this.successCount = 0;  
	}

}