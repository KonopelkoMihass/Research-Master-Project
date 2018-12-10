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
			'attractive',
			'beautiful',
			'clean',
			'dazzling',
			'elegant',
			'fancy',
			'glamorous',
			'floaty', 
			'flying',
			'purple',
			'red'
		];
	
		const r = Math.floor(Math.random() * Math.floor(adjectives.length));
		return adjectives[r].charAt(0).toUpperCase() + adjectives[r].slice(1);
	}
	
	/**
	 * Returns absolutely random human name.
	 * @param {boolean} includeOf Will add 'of' after the name.
	 * @param {boolean} includeThe Will add 'the' after the name.
	 * @returns {string} The name.
	 */
	getHumanName(includeOf = false, includeThe = false) {
		const names = [
			'John',
			'Rafael',
			'Darren',
			'Sebastian',
			'David',
			'Brandon',
			'Bart',
			'Sasha', 
			'Alex',
			'Eric',
		];
	
		const r = Math.floor(Math.random() * Math.floor(names.length));
		let name = names[r].charAt(0).toUpperCase() + names[r].slice(1);
		
		if (includeOf) {
			name += ' of';
		}
	
		if (includeThe) {
			name += ' the';
		}
		
		return name;
	}
	
	// More Code
	
}
		
		
		
		
		
		
		
		
		
		