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

	// Some in between methods.
	
	/**
	 * Returns absolutely random human name.
	 * @param {boolean} includeOf Will add 'of' after the name.
	 * @param {boolean} includeThe Will add 'the' after the name.
	 * @returns {string} The name.
	 */
	getHumanName(include_of, include_the) {
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
	
	// Rest of this class.
	
}
		
		
		
		
		
		
		
		
		
		