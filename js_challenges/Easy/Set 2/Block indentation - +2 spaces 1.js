function divide(value1, value2) {
	if (value1 === 0) {
	 return 0;
	} else if (value2 === 0) {
		console.error('Cannot divide by 0');
		return 0;
	} else {
		return value1/value2;
	}
}