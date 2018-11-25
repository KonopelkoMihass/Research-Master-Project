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

    const WORLD_CENTRE = this.worldMetric.WORLD_CENTRE;
    const WINDOW_WORLD_SIZE = 
				this.worldMetric.pixelToWorld(this.worldMetric.resolution);
    this.soundManager.play("background-song", false, true);

		/**
		 * Defined as the background image for this scene.
		 * @private @let @type {{
		 *    texture: HTMLImageElement, 
		 *		position: Vector2, 
		 *		size: Vector2, 
		 *		loaded: boolean
		 * }}
		 */
		this.background = {
				texture: new Image(),
				position: new Vector2(WORLD_CENTRE.x, WORLD_CENTRE.y),
				size: new Vector2(WINDOW_WORLD_SIZE.x, WINDOW_WORLD_SIZE.y),
				loaded: false
		};

		/**
		 * Defined as the filter that applies fade in effect.
		 * @private @let @type {{
		 *    color: Color, 
		 *		position: Vector2, 
		 *		size: Vector2, 
		 *		fade: number, 
		 *		fadeOut: boolean
		 * }}
		 */
		this.filter_ = {
				color: new Color(0, 0, 0, 255),
				position: new Vector2(0, 0),
				size: new Vector2(WINDOW_WORLD_SIZE.x, WINDOW_WORLD_SIZE.y),
				fade: 200,
				fadeOut: false
		};

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
		
		
		/**
		 * Defined as a loading text.
		 * @private @let @type {{
		 *		position: Vector2, 
		 *		color: Color, 
		 *		font: string, 
		 *		fontsize: number, 
		 *		text: string, 
		 *		loaded: boolean
		 * }}
		 */
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

		this.setupLoadEvents();
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
	 * Used to be able to tell the
	 * SceneManager to go to another scene.
	 */
   leave() {
		this.nextSceneId = 'main-menu';
		super.leave();
  }

	/**
	 * Update scene's elements.
	 * @param {Number} dt delta time between each update call 
	 *    in milliseconds.
	 */
	update(dt) {
		super.update(dt);
		if (this.background_.loaded) {
			let filter = this.filter_;
			if (filter.fadeOut) {
				filter.color.alpha += filter.fade * dt / 1000;
				if (filter.color.alpha > 255) {
					filter.color.alpha = 255;
					this.leave();
				}
			} else {
				if (filter.color.alpha !== 0) {
					filter.color.alpha -= filter.fade * dt / 1000;
				} else if (filter.color.alpha < 0) {
					filter.color.alpha = 0;
				}
			}
		} else {
			let loadingText = this.loadText_;
			loadingText.timer += dt;
			if (loadingText.timer > loadingText.timePerDot) {
				loadingText.timer = 0;
				const length = loadingText.text.length;
				if (length === 10) {
					loadingText.text = 'Loading';
				}	else {
					loadingText.text += '.';
				}
			}
		}
	}

	/**
   * Draw the scene\'s elements to the canvas.
   * @param {CanvasRenderingContext2D} context2D the canvas' 2d context 
	 *    used as target for drawing.
   * @param {WorldMetric} worldMetric the world metric system, used to 
	 *    convert world units into pixel units.
	 */
	draw(context2D, worldMetric) {
		super.draw(context2D, worldMetric);
		if (this.background_.loaded) {
			const backgroundPixelImage = {
					texture: this.background_.texture,
					position: worldMetric.worldToPixels(this.background_.position),
					rotation: MathF.rad(0),
					size: worldMetric.worldToPixels(this.background_.size)
      };
      context2D.setTransform(
					1, 
					0, 
					0, 
					1, 
					backgroundPixelImage.position.x, 
					backgroundPixelImage.position.y
			);
      context2D.rotate(backgroundPixelImage.rotation);
      context2D.drawImage(
					backgroundPixelImage.texture, 
					backgroundPixelImage.size.x * -0.5, 
					backgroundPixelImage.size.y * -0.5, 
					backgroundPixelImage.size.x, 
					backgroundPixelImage.size.y
			);
    }
    if (this.TITLE.loaded) {
			const titlePixel = {
					position: worldMetric.worldToPixels(this.TITLE.position),
					color: this.TITLE.color,
					font: this.TITLE.fontsize.toString() + 'vw ' + this.TITLE.font,
					align: this.TITLE.align,
					text: this.TITLE.text
			};
			context2D.textAlign = titlePixel.align;
			context2D.font = titlePixel.font;
			context2D.setTransform(
					1,
					0,
					0,
					1,
					titlePixel.position.x,
					titlePixel.position.y
			);
			context2D.fillStyle = titlePixel.color.rgba();
			context2D.fillText(titlePixel.text, 0, 0);
    }
    const filterPixel = {
				position: worldMetric.worldToPixels(this.filter_.position),
				size: worldMetric.worldToPixels(this.filter_.size),
				color: this.filter_.color,
				alpha: this.filter_.color.alpha / 255
		};
		
		context2D.setTransform(
				1, 
				0, 
				0, 
				1, 
				filterPixel.position.x, 
				filterPixel.position.y
		);
		context2D.globalAlpha = filterPixel.alpha;
		context2D.fillStyle = filterPixel.color.rgba();
		context2D.fillRect(0, 0, filterPixel.size.x, filterPixel.size.y);

    if (!this.background_.loaded) {
			const fontParameter = 
					this.loadText_.fontsize.toString() + 'vw ' + this.loadText_.font;
			
			let loadingTextPixel = {
					position: worldMetric.worldToPixels(this.loadText_.position),
					color: this.loadText_.color,
					font: fontParameter,
					align: this.loadText_.align,
					text: this.loadText_.text
			};
			context2D.textAlign = loadingTextPixel.align;
			context2D.font = loadingTextPixel.font;
			context2D.setTransform(
					1, 
					0, 
					0, 
					1, 
					loadingTextPixel.position.x, 
					loadingTextPixel.position.y
			);
			context2D.rotate(0);
			context2D.fillStyle = loadingTextPixel.color.rgba();
			context2D.fillText(loadingTextPixel.text, 0, 0);
		}
    context2D.globalAlpha = 1.0;
	}

	/**
	 * Setups events required for loading data.
	 */
	setupLoadEvents() {
		const background = this.background_;
		/**
		 * Called when background.texture is fully loaded.
		 * @param {Event} event Represents the event data.
		 */
		const backgroundLoad = function (event) {
				background.loaded = true;
		};
		background.texture.addEventListener(
				'load", 
				backgroundLoad.bind(this), 
				false
		);
		
		const client = Scene.client;
		let title = this.TITLE;

		/**
		 * Called when the client connection is fully loaded.
		 * @param {ProgressEvent} event Defines the event data.
		 */
		const splashScreenSize = function (event){
			const JsonData = Scene.clientJsonData;

			// Contains our splash scene json data
			const splashData = JsonData[this.id];

			// interpret background data
			const backgroundData = splashData["background"];
			background.texture.src = backgroundData["filepath"];

			// interpret title data
			const titleData = splashData["title"];
			title.font = titleData["font"];
			title.fontsize = titleData["font-size"];
			title.text = titleData["text"];
			const titleColourData = titleData["color"];
			title.color = new Color(
					titleColourData["r"],
					titleColourData["g"],
					titleColourData["b"],
					titleColourData["a"]
			);
			title.loaded = true;
		};
		client.addEventListener(
				'loadend', 
				splashScreenSize.bind(this), 
				false
		);
	}

	/**
	 * Callback function on touch start.
	 * @param {TouchEvent} event Holds the touch event data.
	 */
  onTouchStart(event) {
    super.onTouchStart(event);
  }

	/**
	 * Callback function on touch move.
	 * @param {TouchEvent} event Holds the touch event data.
	 */
  onTouchMove(event) {
    super.onTouchMove(event);
  }

  /**
	 * Callback function on touch end.
	 * @param {TouchEvent} event Holds the touch event data.
	 */
	onTouchEnd(event){
		super.onTouchEnd(event);
		this.filter_.fadeOut = true;
	}

  /**
	 * Callback function on keyboard down.
	 * @param {KeyboardEvent} event Holds keyboard event data.
	 */
	onKeyDown(event) {
		super.onKeyDown(event);
	}

  /**
	 * Callback function on keyboard up.
	 * @param {KeyboardEvent} event Holds keyboard event data.
	 */
	onKeyUp(event) {
		super.onKeyUp(event);
		this.filter_.fadeOut = true;
	}

	/**
	 * Callback function on mouse click event.
	 * @param {MouseEvent} event Holds mouse event data.
	 */
	onClick(event) {
		super.onClick(event);
		this.filter_.fadeOut = true;
	}
}