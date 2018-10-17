// Main Game class, which contains game related code.
class Game
{
	constructor()
	{
		// Logic
	}

	// Initialise the game related managers and setup the scenes.
	initialise()
	{
		// Logic
	}

	// Updates the managers for player control, enemies and scenes.
	update()
	{
		// Logic
	}

	// Draws and manages music playback.
	draw(dt)
	{
		if(this.optionScene.mute)
		{
			this.gameScene.stopMusic();
		}
		else
		{
			this.gameScene.startMusic();
		}
		this.sceneManager.render(this.ctx, dt);
	}
}