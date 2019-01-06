function getItemName(catId, itemId) {
	const weapons = ['Sword', 'Mace', 'Dagger'];
	const armours = ['Steel Helmet', 'Iron Gloves', 'Rusty Chainmail'];
	const spellbooks = ['Necronomicon', 'Bible', 'Merlin\'s Tome'];
	
	let categoryArray = [];
	try {
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
			throw new Error('Wrong ID');
		}
	} catch(e) {
		console.log(e);
	}
	
	let item = '';
	try {
		item = categoryArray[itemId];
	} catch (e) {
		console.log(e);
	}
			
	return item;		
}

		
		
		
		
		
		
		
		
		
		