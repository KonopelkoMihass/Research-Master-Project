
class Sprite
{
	constructor(context, imageOptions)
	{
		this.width = imageOptions.width;	// Width of the sprite.
		this.height = imageOptions.height;	// Height of the sprite.
		this.image = imageOptions.image;	// Image used for the sprite.

		this.x = imageOptions.x;			// X position of the sprite.
		this.y = imageOptions.y;			// Y position of the sprite.

		this.mode = "normal";				// This will command how to draw
											// the sprite i.e. flipped.
	}

	changeMode(mode)
	{
		this.mode = mode;
	}

	moveTo(x, y)
	{
		this.x += x;
		this.y += y;
	}

	render(ctx)
	{
		// Render method.
	}
}