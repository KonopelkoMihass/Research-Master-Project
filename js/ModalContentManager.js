/**Loads HTML templates, makes them available to the app views**/
class ModalContentManager
{
	constructor()
	{
		this.cache={};
		this.successCount = 0;
	  	this.errorCount = 0;

	  	this.modals = [
	  		"add-assignment",
			"submit-assignment",
			"select-review-student",
			"rocket-game",
			"submit-challenge-file",
			"challenge-end"
		];
	}



	downloadAll (downloadCallback)
	{
	  for (var i=0; i<this.modals.length; i++)
	  {
	  		this.downloadModalContent(this.modals[i], downloadCallback);
	  }
	}

	/**Download a single template and store it**/
	downloadModalContent (contentName, downloadCallback)
	{
		var that = this;
		var url = window.location.href+"/modals/"+contentName+".html";
		var xhr = new XMLHttpRequest();

		xhr.onload = function()
		{
			var el = document.createElement( 'html' );
			el.innerHTML = xhr.responseText;

			//get body
			el = el.getElementsByTagName("body")[0];

			//store the template
			that.cache[contentName] = el;
			that.successCount++;

			if (that.isDone())
			{
				downloadCallback();
			}
		};

		xhr.onerror = function()
		{
			that.errorCount++;

			if (that.isDone())
			{
        		downloadCallback();
    		}
		};

		xhr.open("GET", url);
		xhr.send();
	}

	/**
	* Checks if the total success count and error count is equal
	* to total templates to download.
	* @return {boolean} - whether or not the TemplateManager has
	* finished downloading all the HTML templates.
	**/
	isDone ()
	{
	    var result = (this.modals.length === this.successCount + this.errorCount);

	    return result;
	}

	getModalContent(name)
	{

		var modalContent = this.cache[name];

		if(modalContent !== undefined)
		{
		    return modalContent.innerHTML;
		}
	}
}
