// Logic for an event.
let that = this;
img.addEventListener("error", function() {
	that.errorCount_ += 1;
	if (that.isDone()) 
	{
		downloadCallback();
	}
}, false);


