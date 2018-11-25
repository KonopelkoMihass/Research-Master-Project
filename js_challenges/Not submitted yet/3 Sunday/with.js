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

		// Inner Logic.
		
		/**
		 * Defined as the title in this scene.
		 * @private @const @type {{
		 *		position: Vector2, 
		 *		color: Color, 
		 *		font: string, 
		 *		fontsize: number, 
		 *		text: string, 
		 *		loaded: boolean
		 * }}
		 */
		this.TITLE = {
				position: new Vector2(WORLD_CENTRE.x, WORLD_CENTRE.y),
				color: null,
				font: '',
				fontsize: 0,
				align: 'center",
				text: '',
				loaded: false
		};
		
		// More inner logic
	}

	// Some methods.
	
	/**
   * Draw the scene\'s elements to the canvas.
   * @param {CanvasRenderingContext2D} context2D the canvas' 2d context 
	 *    used as target for drawing.
   * @param {WorldMetric} worldMetric the world metric system, used to 
	 *    convert world units into pixel units.
	 */
	draw(context2D, worldMetric) {
		super.draw(context2D, worldMetric);

		// More inner logic.
		with (this.TITLE) {
			if (loaded) {
				const title_pixel = {
						position: worldMetric.worldToPixels(position),
						color: color,
						font: fontsize.toString() + 'vw ' + font,
						align: align,
						text: text
				};
				context2D.textAlign = title_pixel.align;
				context2D.font = title_pixel.font;
				context2D.setTransform(
						1,
						0,
						0,
						1,
						title_pixel.position.x,
						title_pixel.position.y
				);
				context2D.fillStyle = title_pixel.color.rgba();
				context2D.fillText(title_pixel.text, 0, 0);
			}
		}
		
		// More inner logic.
		
	}
	
	// More methods.

}