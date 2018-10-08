// Contains different gameplay interactions characters can do.
// The method from there is stored as a function pointer in an
// object.
class GameplayMethods 
{
	//...
	
	// This is a cooking mechanic method which returns a cooked
	// item based on the supplied parameters.
	cookItem(itemToCook, characterCookLevel, craftingStationLevel)
	{
		var cook_grade;	// Will represent a quality of a cooked item.
		var chance = 25; // A 1 to 100 value represinting a chance to 
						// cook top quality item.
						
		chance -= this.cantCraftPenalty(itemToCook, characterCookLevel)
		chance += this.stationToItemRatio(itemToCook, craftingStationLevel)
		
		var item;  // This wil be an item cooked.
		
		// Generates an item based on chance
		item = app.itemManager.factory.generateItem(itemToCook, chance);
		
		return item;	
	}
	
	
	//... other methods like cantCraftPenalty() and stationToItemRatio()
}