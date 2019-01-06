function getView(views, title) {
	let viewFound = false; let i = 0;

	//find the view
	while (i < views.length && !viewFound) {
		if (views[i].title === title) {
			viewFound = true;
			return views[i];
		}
		i++;
	}
}
