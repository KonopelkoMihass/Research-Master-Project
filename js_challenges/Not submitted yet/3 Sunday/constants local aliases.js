// File: splash_scene.js
/* Line Length ruler.
----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|
         10        20        30        40        50        60        70        80        90        100
*/

/**
 * Splash scene.
 * @class
 * @classdesc
 * 	 	Will contain the fading in and out of a splash image.
 * @extends Scene
 */
class SplashScene extends Scene
{
	/**
	 * Constructs our splash scene.
	 * @constructor
	 */
	constructor() {
		super('splash', 'main-menu');

    const centreOfWorld = this.worldMetric.worldCentre;
    const windowWorldSize = 
				this.worldMetric.pixelToWorld(this.worldMetric.resolution);
    this.soundManager.play("background-song", false, true);
		
		// More constructor logic.
		
	}

	// More of this class.
	
}