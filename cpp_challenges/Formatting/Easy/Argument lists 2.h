/// <summary>
// Pretty brief summary.
/// </summary>
/// <param name="t_texture">A reference to the sprite sheet texture</param>	
/// <param name="t_x">The x position of the projectile</param>
/// <param name="t_x">The y position of the projectile</param>
/// <param name="t_rotation">The rotation angle of the projectile in degrees</param>
void Projectile::init(sf::Texture const & t_texture 
	                  ,double t_x 
	                  ,double t_y 
	                  ,double t_rotation)
{	
	// Some inner logic
}

/// <summary>
// Pretty deep summary.
/// </summary>
/// <param name="t_dt">The delta time</param>
/// <param name="t_wallSprites">A reference to the container of wall sprites</param>
/// <returns>True if this projectile is currently not in use (i.e. speed is zero).</returns>
bool Projectile::update(double t_dt,
												std::vector<sf::Sprite> const &t_wallSprites)
{
	// Inner Logic.
}