class Person {
	constructor(name, age) {
		/** @private @const {!string} */
		this.name_ = name;
		/** @private @let {!number} */
		this.age_ = age;
	}

	get age() {
		return this.age_;
	}
	
	getName() {
		return this.name_;
	}
}