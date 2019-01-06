// Methog in Name generator class
getRandomAdjective() {
	const adjectives = [
		'attractive',
		'beautiful',
		"dazzling",
		"glamorous"
	];

	const r = Math.floor(Math.random() * Math.floor(adjectives.length));
	return adjectives[r].charAt(0).toUpperCase() + adjectives[r].slice(1);
}

	
		
		