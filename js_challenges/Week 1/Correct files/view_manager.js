// File: view_manager.js
/* Line Length ruler.
----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|
         10        20        30        40        50        60        70        80        90        100
*/

/**Keeps track of views, add views, switch to a given view.
* @constructor
*/
class ViewManager {
	constructor() {
		this.views = [];
		this.currentView = undefined;

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
		}
	}

	/** Adds a view to its collection.
	* @param {Object} view View object to be added.
	*/
	addView (view) {
		this.views.push(view);
	}

	/** Looks for a view based on the provided title to switch to.
	* Checks if a view has been found and does exist,
	* if so, then hide current view, and show the new one.
	* @param {string} title The title of a view to view.
	*/
	goToView (title) {
		let viewFound = false;
		let i = 0;

		//find the view
		while (i < this.views.length && !viewFound) {
			if (this.views[i].title === title) {
				viewFound = true;
				this.nextView = this.views[i];
			}
			i++;
		}

		if (viewFound) {//check that the current view exists
			if (this.currentView !== undefined) {//if it does, then hide it
				console.log("Change view from: "+this.currentView.title);
				this.currentView.hide();
			}

			//update new current view and show it
			this.currentView = this.nextView;
			console.log("Change view to: " + this.currentView.title);
			this.currentView.show();
		}
		else {//warn that the view don't exist
			console.warn("View not found: " + title);
		}
	}
}