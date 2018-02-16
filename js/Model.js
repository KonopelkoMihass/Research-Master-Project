/**Superclass that models extend from**/
class Model
{
	constructor()
	{
		this.observers=[];
	}

	addObserver (observer)
	{
		this.observers.push(observer);
	}

	/**Call this whenever the model changes (in this case the rating of the film)**/
	notify (model)
	{
		for(var i=0; i<this.observers.length; i++)
		{
			this.observers[i].onNotify(model);
		}
	}
}
