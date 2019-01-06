function getRandomAdjective() {
	const adjectives = [
		'attractive', 'beautiful',
		'clean'];

	const r = Math.floor(Math.random() * Math.floor(adjectives.length));
	return adjectives[r].charAt(0).toUpperCase() + adjectives[r].slice(1);
}
	