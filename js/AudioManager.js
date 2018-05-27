function AudioManager()
{
	this.audioContext={};
	this.audioBuffers=[];

    this.resourcePath = "resources/audio/";

	this.downloadQueue=[];
	this.cache={};
	this.successCount = 0;
    this.errorCount = 0;

    // Sounds that are currently playing
    this.playingSounds={};

	try {
    	// Fix up for prefixing (don't have to write "webkit" all the time)
    	window.AudioContext = window.AudioContext||window.webkitAudioContext;
    	this.audioContext = new AudioContext();
  	}
    catch(e) {
        alert('Web Audio API is not supported in this browser');
    }

}

/**
 * Load the sound file.
 * @param filename - name to refer to sound.
 * @param downloadCallback - function to call.
 */
AudioManager.prototype.loadSoundFile = function (filename, downloadCallback) {
	var that = this;
	var url =  this.resourcePath+filename;
	
	var xhr = new XMLHttpRequest();
	xhr.open('GET', url, true);
	xhr.responseType = 'arraybuffer';
 
	xhr.onload = function(e) {
	    //buffer containing sound returned by xhr
        var arrayBuffer=this.response;
        that.audioContext.decodeAudioData(arrayBuffer, function(buffer) {
            //associate the audio buffer with the sound name so can use the decoded audio later.
	        that.audioBuffers[filename]=buffer;
	        that.successCount++;
	        if (that.isDone()) {
	            downloadCallback();
	        }
        }, function(e) {
            that.errorCount++;
            if (that.isDone()) {
          	    downloadCallback();
            }
            console.log('Error decoding file', e);
        });
    };

  //send the xhr request to download the sound file
  xhr.send();
};

/**
 * Plays the list of sounds sequentially.
 * param playlist - contains {name_of_sound, element name to display when the sound finishes}
 */
AudioManager.prototype.playPlaylist = function(playList, callback) {
    var that = this; 
    var sounds = [];
    var currentSound = 0;

    for (var [key, value] of playList) {
      console.log(key + " = " + value);
      sounds.push(key);
    }      

    function next() {
        currentSound++;
        if(currentSound < sounds.length) {
            that.playSnippet(sounds[currentSound], next);
            //show picture then show sound
            var elementToDisplay = playList.get(sounds[currentSound]);
            if(elementToDisplay != undefined) {
                app.viewManager.showElement(elementToDisplay);
            }
        }
        else {
            if(callback != undefined) {
                callback();
            }
        }
    }

    this.playSnippet(sounds[currentSound], next);
};

/**
 * Plays sound
 * startTime and duration are optional
 */
/**
 * Plays a sound.  startTime & duration are optional.
 * @param filename - name of a sound and extension.
 * @param volume - sets the volume to play sound at.
 * @param startTime - from where it plays a sound.
 * @param duration - for how long it plays a sound.
 */
AudioManager.prototype.playSound = function(filename, volume,  startTime, duration, callback = null) {
    // No callback
    this.playSnippet(filename, volume, callback, startTime, duration);
};

/**
 * Plays sound if it has been loaded, otherwise does nothing.
 * @param filename - a name and an extension of the sound to play.
 * @param callback - optional: function to call when sound finishes playing.
 * @param startTime - from where it plays a sound.
 * @param duration - for how long it plays a sound.
 */
AudioManager.prototype.playSnippet = function(filename, volume, callback, startTime, duration) {
    if (this.audioBuffers[filename] == undefined) {
        return;
    }

    // Retrieve the buffer we stored earlier
    var audioBuffer = this.audioBuffers[filename];

    // Create a buffer source - used to play once and then a new one must be made
    var source = this.audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.loop = false;

    // Create gain connector to control volume.
    var gainNode =  this.audioContext.createGain ? this.audioContext.createGain() : this.audioContext.createGainNode();

    // Connect source to it.
    source.connect(gainNode);

    // Then connect gain to destination.
    gainNode.connect(this.audioContext.destination);

    // Modify volume.
    gainNode.gain.value = volume;
  
    if(callback != undefined) {
        source.onended = callback;
    }

    if(startTime != undefined){
        if(duration != undefined) {
            source.start(0, startTime, duration);
        }
        else{
            source.start(0, startTime);
        }
    }

    else {
        source.start(0); // Play immideately.
    }
    this.playingSounds[name]=source;
};

/**
 * Stops a sound.
 * @param filename - a name and an extension of the sound to stop.
 */
AudioManager.prototype.stopPlayingSound = function(filename) {
	if (!this.playingSounds[name]) {
		return;
	}
	else {
		this.playingSounds[name].stop(0);
	}
};

/**
 * Plays an empty sound.  This is for iOS (user needs to interact e.g. touch a button which
 * causes a sound to be played in order to be able to play sounds without user interaction)
 */
AudioManager.prototype.playEmptySound = function() {
	// Create empty buffer
	// https://paulbakaus.com/tutorials/html5/web-audio-on-ios/
	var buffer = this.audioContext.createBuffer(1, 1, 22050);
	var source = this.audioContext.createBufferSource();
	source.buffer = buffer;
	source.connect(this.audioContext.destination);

	// play the file
	source.start(0);
};

/**
 * Queues a sound for downloading.
 * @param soundName - name and extension of a file to load.
 */
AudioManager.prototype.queueSound = function(soundName) {
	this.downloadQueue.push(soundName);
};

/**
 * Downloads all queued sounds.
 * @param downloadCallback - a function to call once download is complete.
 */
AudioManager.prototype.downloadAll = function(downloadCallback) {
    for (var i=0; i<this.downloadQueue.length; i++) {
        this.loadSoundFile(this.downloadQueue[i], downloadCallback);
    }
};


//
// @return {boolean} - whether or not the AudioManager has
// finished downloading all the sounds.
/**
 * Checks if the total success count and error count is equal to total sounds to download.
 * @returns {boolean} - whether or not the AudioManager has finished downloading
 * all the sounds.
 */
AudioManager.prototype.isDone = function() {
    console.log("AudioManager success count " + this.successCount +" / "+ this.downloadQueue.length + ' errors: '+ this.errorCount);
    result= (this.downloadQueue.length == this.successCount + this.errorCount);
    return result;
};



