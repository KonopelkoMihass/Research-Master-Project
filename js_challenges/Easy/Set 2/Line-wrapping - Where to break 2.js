getHumanName(includeOf, includeThe) {
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

	const random = Math.floor(Math.random() * Math.floor(names.length));
	let name = names[random].charAt(0).toUpperCase() + 
		names[random].slice(1);
		
	random = Math.floor(Math.random() * Math.floor(names.length));
	let name2 = 
		names[random].charAt(0).toUpperCase() + names[random].slice(1);
}
		
		
		
		
		