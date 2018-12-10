// File: name_generator.js
/* Line Length ruler.
----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|
         10        20        30        40        50        60        70        80        90        100
*/

/**
 * This class generates names.  Can be used for monsters, NPCs and 
 * items
 */
class NameGenerator {
	constructor(){}
	
	// Some internal logic.
	
	/**
	 * Returns absolutely random human name.
	 * @param {number} catId The category assosiated with the item.
	 * @param {number} itemId The item id.
	 * @returns {string} The item name.
	 */
	getItemName(catId, itemId) {
		const weapons = ['Sword', 'Mace', 'Dagger'];
		const armours = ['Steel Helmet', 'Iron Gloves', 'Rusty Chainmail'];
		const spellbooks = ['Necronomicon', 'Bible', 'Merlin\'s Tome'];
		
		let categoryArray = [];

		switch (catId) {
			case 0:
				categoryArray = weapons;
				break;

			case 1:
				categoryArray = armours;
				break;
				
			case 2:
				categoryArray = spellbooks;
				break;
		}

		let item = '';
		try{
			item = categoryArray[itemId];
		} catch (e) {
			console.log(e);
		}
				
		return item;		
	}
}
		
		
		
		
		
		
		
		
		
		