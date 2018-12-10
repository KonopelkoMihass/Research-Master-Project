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
	
	/**
	 * Returns absolutely random adjective.
	 * @returns {string} The adjective.
	 */
	getRandomAdjective() {
		const adjectives = [
			"attractive", "beautiful",
			"clean", "dazzling",
			"elegant", "fancy",
			"glamorous", "floaty", 
			"flying", "purple",
			"red"];
	
		const result = Math.floor(Math.random() * Math.floor(adjectives.length));
		return adjectives[result].charAt(0).toUpperCase() + adjectives[result].slice(1);
	}
	
	/**
	 * Returns absolutely random human name.
	 * @param {boolean} includeOf Will add "of" after the name.
	 * @param {boolean} includeThe Will add "the" after the name.
	 * @returns {string} The name.
	 */
	getHumanName(includeOf, includeThe) {
		const names = [
			"John",
			"Rafael",
			"Darren",
			"Sebastian",
			"David",
			"Brandon",
			"Bart",
			"Sasha", 
			"Alex",
			"Eric"
		];
	
		const result = Math.floor(Math.random() * Math.floor(names.length));
		let name = names[result].charAt(0).toUpperCase() + names[result].slice(1);
		
		if (includeOf) {
			name += " of";
		}
	
		if (includeThe) {
			name += " the";
		}
		
		return name
	}
	
	/**
	 * Returns absolutely random human name.
	 * @param {number} catId The category assosiated with the item.
	 * @param {number} itemId The item id.
	 * @returns {string} The item name.
	 */
	getItemName(catId, itemId) {
		const weapons = ["Sword", "Mace", "Dagger"];
		const armours = ["Steel Helmet", "Iron Gloves", "Rusty Chainmail"];
		const spellbooks = ["Necronomicon", "Bible", "Merlin's Tome"];
		
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
				
			default:
				throw new Error("Wrong ID");
		
		let item = "";
		try{
			item = categoryArray[itemId];
		} catch (e) {
			console.log(e);
		}
				
		return item;		
}
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
	}
}