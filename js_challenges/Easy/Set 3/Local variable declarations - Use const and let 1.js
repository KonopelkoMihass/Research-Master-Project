// Method in Audio manager.
playEmptySound() {
	// Create empty buffer
	// https://paulbakaus.com/tutorials/html5/web-audio-on-ios/
	var buffer = this.audioContext_.createBuffer(1, 1, 22050);
	var source = this.audioContext_.createBufferSource();
	source.buffer = buffer;
	source.connect(this.audioContext_.destination);

	// play the file
	source.start(0);
}
