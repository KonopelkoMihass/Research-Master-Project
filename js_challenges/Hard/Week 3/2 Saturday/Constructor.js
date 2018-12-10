// File: splash_scene.js
/* Line Length ruler.
----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|
         10        20        30        40        50        60        70        80        90        100
*/

/**
 * Splash scene.
 * @class
 * @classdesc
 *    Will contain the fading in and out of a splash image.
 * @extends Scene
 */
class SplashScene extends Scene
{
	/**
	 * Constructs our splash scene.
	 * @constructor
	 */
	constructor() {
    const WORLD_CENTRE = this.worldMetric.WORLD_CENTRE;
    const WINDOW_WORLD_SIZE = 
				this.worldMetric.pixelToWorld(this.worldMetric.resolution);
    this.soundManager.play('background-song', false, true);
		
		/**
		 * Defined as the background image for this scene.
		 * @private @let @type {{
		 *    texture: HTMLImageElement, 
		 *		position: Vector2, 
		 *		size: Vector2, 
		 *		loaded: boolean
		 * }}
		 */
		this.background_ = {
				texture: new Image(),
				position: new Vector2(WORLD_CENTRE.x, WORLD_CENTRE.y),
				size: new Vector2(WINDOW_WORLD_SIZE.x, WINDOW_WORLD_SIZE.y),
				loaded: false
		};
		
		super('splash', 'main-menu');

		// More constructor logic.
		
	}
	
	// More code.
	
}