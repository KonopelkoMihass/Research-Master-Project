// Constructor for the Splash Scene class
constructor() {
	super('splash', 'main-menu');

	this.background = {
		texture: new Image(),
		position: new Vector2(WORLD_CENTRE.x, WORLD_CENTRE.y),
		size: new Vector2(WINDOW_WORLD_SIZE.x, WINDOW_WORLD_SIZE.y),
		loaded: false
	};

	this.filter_ = {
		color: new Color(0, 0, 0, 255),
		
		position: new Vector2(0, 0),
		size: new Vector2(WINDOW_WORLD_SIZE.x, WINDOW_WORLD_SIZE.y),
		
		fade: 200,
		fadeOut: false
	};

	this.TITLE = {
		position: new Vector2(WORLD_CENTRE.x, WORLD_CENTRE.y),
		color: null,
		font: '',
		fontsize: 0,
		align: 'center",
		text: '', loaded: false	};
	
	this.loadText = {
		position: new Vector2(WORLD_CENTRE.x * 0.95, WORLD_CENTRE.y),
		
		color: new Color(255, 255, 255, 255),
		
		font: 'Verdana",
		fontsize: 2,
		align: 'left',
		
		text: 'Loading',
		
		timer: 0.0,
		timePerDot: 100
	};
}