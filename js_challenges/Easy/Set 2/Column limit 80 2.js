/* Line Length ruler.
----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|
         10        20        30        40        50        60        70        80        90        100
*/

// Method withn an Audio Manager class
loadSoundFile(filename, downloadCallback) {
	let that = this;
	let url = this.RESOURCE_PATH + filename;

	let xhr = new XMLHttpRequest();
	xhr.open('GET', url, true);
	xhr.responseType = 'arraybuffer';

	xhr.onload = function(e) {
		//buffer containing sound returned by xhr
		let arrayBuffer = this.response;
		that.audioContext_.decodeAudioData(arrayBuffer, function(buffer) {
			// associate the audio buffer with the sound name so can use the decoded audio later.
			that.audioBuffers_[filename] = buffer;
			console.log('Sound was loaded.');
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

	