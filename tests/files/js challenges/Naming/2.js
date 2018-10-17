// This is an slime enemy class which contains 
// methods related to it's interaction with the game 
// world.
class slimeEnemy
{
    constructor()
    {
		// Private
		this.health = 100;				// health of the enemy.  
		this.movementSpeed = 25;		// speed of enemy's movement in the world view.
		this.attackDamage = 20;			// attack damage enemy deals 
										// defaultly (without weapons)
		this.disposition = 1;			// Simple state machine variable:
										// 0 - neutral
										// 1 - enemy to player
										// 2 - ally to player								
				
		// Public
		this.name = "Hungry Slime";		// the name for the enemy.
		
	}
	
	// This function modifies disposition of this enemy based
	// on the food item passed as a parameter.
	FeedSlime(item)
	{
		// Logic..
	}
	
	// ...
}