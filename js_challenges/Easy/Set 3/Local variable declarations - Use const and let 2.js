function getCenter(position, size) {
	const posX = position.x;
	const posY = position.y;
	let widthHalf = size.x / 2;
	let heightHalf = size.y / 2;
	var vector = new Vector2(posX + widthHalf, posY + heightHalf);
	return vector;
}
