/**Superclass that models extend from**/
class Model
{
	constructor()
	{
		this.observers=[];
	}

	addObserver (observer, messageType)
	{
		if (!(messageType in this.observers))
		{
			this.observers[messageType] = [];
		}

		this.observers[messageType].push(observer);
	}

	/**Call this whenever the model changes (in this case the rating of the film)**/
	notify (messageType)
	{


		if (this.observers[messageType] !== undefined)
		{
			for (var i = 0; i < this.observers[messageType].length; i++)
			{
				this.observers[messageType][i].onNotify(this, messageType);
			}
		}

		/*else
		{
			console.log("Trying to notify a view that doesn't exist.  " +
				"Check that the correct model is assigned the right observer in App.js");
			console.log("If all works as intended - ignore the message");
		}*/
	}
}
