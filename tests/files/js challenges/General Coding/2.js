// This is an slime enemy class which contains 
// methods related to it's interaction with the game 
// world.
class SlimeEnemy
{
    constructor()
    {
		this.health = 100;				// health of the enemy.  
		this.movementSpeed = 25;		// speed of enemy's movement in the world view.
		this.attackDamage = 20;			// attack damage enemy deals 
										// defaultly (without weapons)
		this.name = "Hunry Slime";		// the name for the enemy.
		this.disposition = 1;			// Simple state machine variable:
										// 0 - neutral
										// 1 - enemy to player
										// 2 - ally to payer
	}
	
	// This function modifies disposition of this enemy based
	// on the food item passed as a parameter.
	feedSlime(item)
	{
		
	}
	
	// ...
}