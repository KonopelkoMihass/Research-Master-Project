
function getHumanName(includeOf, includeThe) {
	const names = [
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

		
		
		
		
		
		
		
		
		
		