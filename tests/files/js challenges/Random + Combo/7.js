/**
 * Helper function that returns a string of the form "rgb(r,g,b)" where r,g and b are numeric values.
 *
 */
function rgb(r, g, b)
{
	return 'rgb('+clamp(Math.round(r), 0, 255)+','+clamp(Math.round(g), 0, 255)+','+clamp(Math.round(b), 0, 255)+')';
}

function rnd(min, max)
{
	return Math.floor(Math.random() * (max - min + 1) + min);
}