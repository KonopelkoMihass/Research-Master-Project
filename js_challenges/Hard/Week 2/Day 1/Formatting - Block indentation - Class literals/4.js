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
		// logic
	}
	
	/**
	 * Returns absolutely random human name.
	 * @param {boolean} includeOf Will add "of" after the name.
	 * @param {boolean} includeThe Will add "the" after the name.
	 * @returns {string} The name.
	 */
	getHumanName(includeOf, includeThe) {
		// logic
	}
	
	/**
	 * Returns absolutely random human name.
	 * @param {number} catId The category assosiated with the item.
	 * @param {number} itemId The item id.
	 * @returns {string} The item name.
	 */
	getItemName(catId, itemId) {
		// logic	
	}
};