class Minotaur
{
	constructor(health, attackDamage, movement)
	{
		this.health = health;				// Health of the minotaur.
		this.attDmg = attackDamage;			// Attack of a minotaur 
											// in the melee.
		this.movement = movement;			// The speed of the minotaur
											// in the labyrinth.
	}
	
	// Update Method which takes map as a parameter to A* it.
	update(map)
	{
		if(health <== 0)
		{
			console.log("Kaputt!");
		}
		else
		{
			this.searchForIntruder(map);
	   }
	}
	
	// Private Methods.
	
	// Will select an area to go by randomly 
	// selecting a direction to go before hitting a crossroad.
    searchForIntruder(map)
	{
		//...
	}
}