// This is a player class which contains methods
// related to player's interaction with the game 
// world.
class Player
{
    constructor()
    {
		this.health = 100;		// health of the player.
		this.mv_spd = 20;	// speed of player's movement in the world view.
		this.att_dmg = 1;		// attack damage player deals 
								// defaultly (without weapons)
		this.name = "Chubby McGoffy";	// the temporary name for the player.
	}
	
	update()
	{
		// ...
	}
	
	// ...
}