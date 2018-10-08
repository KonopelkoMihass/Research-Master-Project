// This is a player class. 
class Player
{
    constructor()
    {
		this.health = 100;		// the health of player.
		this.movmentSpeed = 20; // movement speed in the world map.
		this.x = -1;			// position on X axis.
		this.y = -1;			// position on Y axis.
	}
	
	// Spawns player in a random position.
	Spawn()
	{
		// a function pointer.  Accepts min and max parameters.
		var randFunc = app.utilities.getRandom; 
		this.x = randFunc(0, 100);
		this.y = randFunc(0, 100);
     }
}