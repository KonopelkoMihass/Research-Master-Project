// Method in Audio Manager Class.
isDone() {
	let result = this.successCount_ + ' / '  + this.downloadQueue_.length + 
			' errors: ' + this.errorCount_;
	
	console.log('AudioManager success count ' + result);
	return (this.downloadQueue_.length == this.successCount_ + this.errorCount_);
} 
