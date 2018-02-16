/**Loads HTML templates, makes them available to the app views**/
class TemplateManager
{
	constructor()
	{
		this.downloadQueue = [];
		this.cache={};
		this.successCount = 0;
	  	this.errorCount = 0;
	}

	/**Queue a template for downloading**/
	queueTemplate (templateName)
	{
		this.downloadQueue.push(templateName);
	}

	/**
	* Downloads all templates
	* @param {function} downloadCallback
	* function called when all the templates are downloaded
	**/
	downloadAll (downloadCallback)
	{
	  for (var i=0; i<this.downloadQueue.length; i++)
	  {
	  		this.downloadTemplate(this.downloadQueue[i], downloadCallback);
	  }
	}

	/**Download a single template and store it**/
	downloadTemplate (templateName, downloadCallback)
	{
		var that = this;
		var url = window.location.href+"/views/"+templateName+"/"+templateName+".html";
		var xhr = new XMLHttpRequest();

		console.log("url: " + url);

		xhr.onload = function()
		{
			var el = document.createElement( 'html' );
			el.innerHTML = xhr.responseText;

			//get body
			el = el.getElementsByTagName("body")[0];
			console.log("el: " + el);

			//store the template
			that.cache[templateName] = el;
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
	    console.log("TemplateManager success count " + this.successCount +" / "+ this.downloadQueue.length + ' errors: '+ this.errorCount);
	    var result= (this.downloadQueue.length == this.successCount + this.errorCount);

	    return result;
	}

	/**
	 * Processes template e.g. corrects the path to the image resources.
	 * @param {Object} - the HTML template as DOM
	 * @return {Object} - the processed HTML template as DOM
	 **/
	processTemplate (template)
	{

	}

	loadFromCache()
	{
		for(var index in this.cache)
		{
			//add root element for this view
			var divNode = document.createElement("div");
			divNode.id = index;
			document.body.appendChild(divNode);
			var view = this.cache[index];

			if(index == undefined)
			{
				console.error("Trying to use a view that doesn't exist.  Check the this.title in your views exist in ViewManager.VIEW");
			}
			else if(view == undefined)
			{
				console.error(this.title +" view is not defined");
			}
			else
			{
				divNode.innerHTML = this.cache[index].innerHTML;
			}
		}
	}
}
