try {
	switch (gameEvent) {
		case 'save_game':
			game.save();
			break;
		case 'load_game':
			game.load();
			break;
			
		case 'error_loading':
			throw new Error('There was an error when loading your game.');			      
			break;
		case 'error_saving':
			throw new Error('Your game did not save.');
			break;
	}
} catch(e) { 
	console.log(e);
}
