
class Minotaur
{
	constructor(health,attackDamage,movement)
	{
		this.health = health;   			// the health of player.    
		this.attackDamage = attackDamage;	// the melee damage of 
											// the Minotaur.
		this.movement = movement;
	}
	
	// Update Method
	Update(map)
	{
		if(health <== 0)
		{
			console.log("I was defeated!");
		}
		else
		{
			this.SearchForIntruder(map);
		}
	}
	
	// Will select an area to go by randomly selecting a direction to go before hitting a crossroad.
	SearchForIntruder(map)
	{
		//...
	}
}