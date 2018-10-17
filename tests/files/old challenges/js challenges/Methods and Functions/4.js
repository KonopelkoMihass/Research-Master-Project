// Part of the Game Class.

// Initialize the game.
initialise()
{
	// Canvas preparing
	{
		// Use the document object to create a new element canvas.
		this.canvas = document.createElement("canvas");
		// Assign the canvas an id so we can reference it elsewhere.
		this.canvas.id = "mycanvas";
		// Set the width and height to match the browser window.
		this.canvas.width = window.innerWidth;
		this.canvas.height = window.innerHeight;
	 }
	
    // We want this to be a 2D canvas
    this.ctx = this.canvas.getContext("2d");
    // Adds the canvas element to the document.
    document.body.appendChild(this.canvas);

    this.gameAssets = [];
    this.menuAssets = [];

    this.sceneManager = new SceneManager();
    this.manager.playSound('bg_music', true);
    // create the touch handler object and bind document touch events to its functions
    this.touch = new TouchHandler();
    document.addEventListener("touchstart", this.touch.touchStart.bind(this.touch, this.touch));
    document.addEventListener("touchend", this.touch.touchEnd.bind(this.touch, this.touch));

    // create each scene seperately, passing args include scene ID and touch handler so each scene has scope of the touch events
	{
		this.menuScene = new MenuScene("Menu", this.touch, this.sceneManager);
		this.gameScene = new GameScene("Game", this.touch, this.sceneManager, this.websocket, this.ctx);
		this.optionScene = new OptionScene("Option", this.touch, this.sceneManager);
		this.endScene = new EndScene("EndScene", this.touch, this.sceneManager, this.websocket);
		this.selectionScene = new SelectionScene("Selection", this.touch, this.sceneManager, this.websocket);
	}

    // adding each created scene to the scene manager for transition control purposes
    this.sceneManager.addScene(this.menuScene);
    this.sceneManager.addScene(this.gameScene);
    this.sceneManager.addScene(this.optionScene);
    this.sceneManager.addScene(this.endScene);
    this.sceneManager.addScene(this.selectionScene);
    this.sceneManager.goToScene(this.menuScene.getName());
    this.sceneManager.render(this.ctx);
}