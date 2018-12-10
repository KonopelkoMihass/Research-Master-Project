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
		this.views_ = [];
		/** @private @let {!View} */
		this.currentView_ = undefined;
		/** @private @const {!Object<string, string} */
		this.View = {
			TITLE_SCREEN: 'title-screen',
			MAIN_MENU: 'main-menu',
			OPTIONS: 'options',
			CREDITS: 'credits',
			LEVEL_SELECTOR: 'level-selector',
			INVENTROY: 'inventory',
			DIALOGUE_SCREEN: 'dialogue-screen',
			BATTLE_SCREEN: 'battle-screen',
			LOAD_GAME_SCREEN: 'load-game-screen',
			SAVE_GAME_SCREEN: 'save-game-screen',
			WORLD_View: 'world-view',
		} ;
	}

	//More code.
	
}