// File: splash_scene.js
/* Line Length ruler.
----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|
         10        20        30        40        50        60        70        80        90        100
*/

/**
 * Splash scene.
 * @class
 * @classdesc
 *	  Will contain the fading in and out of a splash image.
 * @extends Scene
 */
class SplashScene extends Scene
{
	/**
	 * Constructs our splash scene.
	 * @constructor
	 */
	constructor() {
		// Gigantic constructor logic
	}

	/**
	 * Called when scene is selected.
	 */
	start() {
		super.start();
	}

	/**
	 * Called when scene is exited.
	 */
	stop() {
		super.stop();
	}

	/**
	 * Used to be able to tell the SceneManager to go to 
	 * another scene.
	 */
   leave() {
		this.nextSceneId = 'main-menu';
		super.leave();
  }

	/**
	 * Update scene's elements.
	 */
	update(dt) {
		super.update(dt);
		// More internal logic.	
	}
}