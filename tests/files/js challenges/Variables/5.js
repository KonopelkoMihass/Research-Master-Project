// The main class for the applicaiton.
class App
{
	constructor()
	{
		//...
	}
	
	// Setups game managers
	setupManagers()
	{	
		// Create all factories nesessary for the managers.
		var enemyFactory = new EnemyFactory();	// Generates enemies.
		var itemFactory = new ItemFactory();	// Generates use items.
		var $Factory = new TreasureFactory();	// Will generate treasures.
		
		this.enemyManager = new EnemyManager(enemyFactory);
		this.itemManager = new ItemManager(itemFactory);
		this.treasureManager = new TreasureManager($Factory);
		
		//...
	}
}