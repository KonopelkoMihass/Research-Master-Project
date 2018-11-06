// File: view_manager.js
/* Line Length ruler.
----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|
         10        20        30        40        50        60        70        80        90        100
*/

/**
 * Keeps track of views, add views, switch to a given view.
 */
class ViewManager {
	constructor() {
		/** @private @let {!Array{View}} */
		this.views_ = []
		/** @private @let {!View} */
		this.currentView_ = undefined;
		/** @private @const {!Object<string, string} */
		this.VIEW = {
			TITLE_SCREEN: "title-screen",
			MAIN_MENU: "main-menu",
			OPTIONS: "options",
			CREDITS: "credits",
			LEVEL_SELECTOR: "level-selector",
			INVENTROY: "inventory",
			DIALOGUE_SCREEN: "dialogue-screen",
			BATTLE_SCREEN: "battle-screen",
			LOAD_GAME_SCREEN: "load-game-screen",
			SAVE-GAME-SCREEN: "save-game-screen",
			WORLD_view: "world-view",
		};
	}

	/** 
	 * Adds a view to its collection.
	 * @param {View} view View to be added.
	 */
	addView(view) {
		this.views_.push(view);
	}

	/** 
	 * Looks for a view based on the provided title to switch to.
	 * Checks if a view has been found and does exist,
	 * if so, then hide current view, and show the new one.
	 * @param {string} title The title of a view to view.
	 */
	goToView(title) {
		let viewFound = false;
		let i = 0;

		//find the view
		while (i < this.views_.length && !viewFound) {
			if (this.views_[i].title === title) {
				viewFound = true
				this.nextView = this.views_[i];
			}
			i++;
		}
		
		// more logic
		
	}
}