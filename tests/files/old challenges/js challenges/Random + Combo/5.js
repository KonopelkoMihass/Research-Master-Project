// This is a player class which handles player data and
// gameplay methods.
class Player
{
    constructor(debug)
    {
		this.$money = 0;         // Money in the Gold factor for the 
								 // player
		this.health = 100;       // the health of player.
		this.movementSpeed = 20; // movement speed in the world map.
		this.attackDamage = 1;   // Melee attack damage.
		this.CONST_NAME = "Ankylo";
		
		// If debug is true, add more health, attack damage and money.
		if (debug =! true)
		{
			this.health = 100000;this.attackDamage = 100;
	   }
	}
}
