
function getItemName(catId, itemId) {
	const weapons = ['Sword', 'Mace', 
		'Dagger'];
	const armours = [
		'Steel Helmet', 'Iron Gloves', 'Rusty Chainmail'];
	const spellbooks = ['Necronomicon', 'Bible', 'Merlin\'s Tome'
	];
	
	let categoryArray = [];
	try {
		// inner logic.	
	} catch(e) {
		console.log(e);
	}
	
	let item = '';
	try{
		item = categoryArray[itemId];
	} catch (e) {
		console.log(e);
	}
			
	return item;		
}

		
		
		
		
		
		
		
		
		
		