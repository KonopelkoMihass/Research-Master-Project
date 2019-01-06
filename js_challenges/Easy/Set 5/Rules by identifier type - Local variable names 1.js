
class AudioManager {
	constructor() {
		// Inner logic.
	}

	playEmptySound() {
		// Create empty buffer
		// https://paulbakaus.com/tutorials/html5/web-audio-on-ios/
		let TheBuffer = this.audioContext_.createBuffer(1, 1, 22050);
		let Source = this.audioContext_.createBufferSource();
		Source.buffer = TheBuffer;
		Source.connect(this.audioContext_.destination);

		// play the file
		Source.start(0);
	}

	
	isDone() {
		let result = 
			this.successCount_ + ' / '  + 
			this.downloadQueue_.length + ' errors: ' + this.errorCount_;
		
		console.log('AudioManager success count ' + result);
		return (this.downloadQueue_.length == this.successCount_ + this.errorCount_);
	} 
}