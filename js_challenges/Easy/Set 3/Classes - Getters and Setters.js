class NameGenerator {
	constructor(){}
	
	/**
	 * Returns absolutely random adjective.
	 * @returns {string} The adjective.
	 */
	get randomAdjective() {
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
}
		
		
		
		
		
		
		
		
		
		