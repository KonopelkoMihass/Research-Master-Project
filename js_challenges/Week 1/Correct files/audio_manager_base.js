// File: audio_manager_base.js
/* Line Length ruler.
----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|
         10        20        30        40        50        60        70        80        90        100
*/
class AudioManager {
  constructor() {
		this.audioBuffers=[];
		this.audioContext={};
		this.cache={};
		this.downloadQueue=[];
		this.errorCount = 0;
		this.playingSounds={};  // Sounds that are currently playing
		this.resourcePath = "resources/audio/";
		this.successCount = 0;
    
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
  loadSoundFile(filename, downloadCallback) {
	var that = this;
	var url =  this.resourcePath+filename;
	
	var xhr = new XMLHttpRequest();
	xhr.open('GET', url, true);
	xhr.responseType = 'arraybuffer';
 
	xhr.onload = function(e) {
		//buffer containing sound returned by xhr
		var arrayBuffer=this.response;
		that.audioContext.decodeAudioData(arrayBuffer, function(buffer) {
			// associate the audio buffer with the sound name so can use the 
			// decoded audio later.
			that.audioBuffers[filename]=buffer;
			console.log("Sound was loaded.");
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
			
    //send the xhr request to download the sound file
    xhr.send();
  }
  
	/**
	 * Plays the list of sounds sequentially.
	 * param playlist - contains {name_of_sound, element name to display 
	 * when the sound finishes}
	 */
	playPlaylist(playList, callback) {
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
	}

	/**
	 * Plays sound
	 * startTime and duration are optional
	 */
	/**
	 * Plays a sound.  startTime & duration are optional.
	 * @param filename - name of a sound and extension.
	 * @param startTime - from where it plays a sound.
	 * @param duration - for how long it plays a sound.
	 */
	playSound(filename, startTime, duration) {
			// No callback
			var callback = null;
			this.playSnippet(filename, null, startTime, duration);
	};

	/**
	 * Plays sound if it has been loaded, otherwise does nothing.
	 * @param filename - a name and an extension of the sound to play.
	 * @param callback - opt: function to call when sound finishes playing.
	 * @param startTime - from where it plays a sound.
	 * @param duration - for how long it plays a sound.
	 */
	playSnippet(filename, callback, startTime, duration) {
		if (this.audioBuffers[filename] == undefined) {
			return;
		}

		// Retrieve the buffer we stored earlier
		var audioBuffer = this.audioBuffers[filename];

		// Create a buffer source - used to play once and then 
		// a new one must be made
		var source = this.audioContext.createBufferSource();
		source.buffer = audioBuffer;
		source.loop = false;

		// Connect to your speakers
		source.connect(this.audioContext.destination);
	
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
	}

	/**
	 * Stops a sound.
	 * @param filename - a name and an extension of the sound to stop.
	 */
	stopPlayingSound(filename) {
		if (!this.playingSounds[name]) {
			return;
		}
		else {
			this.playingSounds[name].stop(0);
		}
	}

	/**
	 * Plays an empty sound.  This is for iOS (user needs to 
	 * interact e.g. touch a button which causes a sound to be 
	 * played in order to be able to play sounds without user interaction)
	 */
	playEmptySound() {
		// Create empty buffer
		// https://paulbakaus.com/tutorials/html5/web-audio-on-ios/
		var buffer = this.audioContext.createBuffer(1, 1, 22050);
		var source = this.audioContext.createBufferSource();
		source.buffer = buffer;
		source.connect(this.audioContext.destination);

		// play the file
		source.start(0);
	}

	/**
	 * Queues a sound for downloading.
	 * @param soundName - name and extension of a file to load.
	 */
	queueSound(soundName) {
		this.downloadQueue.push(soundName);
	};

	/**
	 * Downloads all queued sounds.
	 * @param downloadCallback - a function to call once download is complete.
	 */
	downloadAll(downloadCallback) {
		for (var i=0; i<this.downloadQueue.length; i++) {
			this.loadSoundFile(this.downloadQueue[i], downloadCallback);
		}
	}


	//
	// @return {boolean} - whether or not the AudioManager has
	// finished downloading all the sounds.
	/**
	 * Checks if the total success count and error count is equal 
	 * to total sounds to download.
	 * @returns {boolean} - whether or not the AudioManager 
	 * has finished downloading all the sounds.
	 */
	isDone() {
		console.log("AudioManager success count " 
			+ this.successCount + " / " 
			+ this.downloadQueue.length + ' errors: '
			+ this.errorCount);
		return (this.downloadQueue.length == this.successCount + this.errorCount);
	} 
}