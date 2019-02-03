// There are 3 structs.

struct Bullet {
	// Content
};

struct Gun 
{
	// Content
};

struct Clip {
	// Content
};

// And there is an if statement from somewhere in a game.
Clip &clip = someClip;
Bullet &bullet = someBullet;

if (clip.ammoCaliber == bullet.caliber)
	clip.bullets.push(bullet);
