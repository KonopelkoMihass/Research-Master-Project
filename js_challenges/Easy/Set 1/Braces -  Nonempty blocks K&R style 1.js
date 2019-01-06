// method from a class.

 /** Setups the HTML related to this view. **/
setup() {
	//add root element for this view
	if (this.title_ === undefined) {
		console.error("Trying to use a view that doesn't exist.");
	} else 
	{ 
		this.root = document.getElementById(this.title_); 
	}
	
	// more
}
