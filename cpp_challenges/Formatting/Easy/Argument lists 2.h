/// <summary>
/// @brief Initialises various properties of the projectile.
/// The projectile speed is set to it's maximum allowable speed.
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
/// @brief Calculates the new position of the projectile.
/// If this projectile is currently in use (on screen, speed non-zero), it's next screen position
///  is calculated along a vector that extends directly from the tip of the tank turret.
/// If the newly calculated position is off-screen, then the projectile speed is reset to 0.
/// Otherwise (projectile still on-screen), a collision check is performed between the projectile
///  and every wall. If the projectile collides with a wall, it's speed is reset to 0.
/// </summary>
/// <param name="t_dt">The delta time</param>
/// <param name="t_wallSprites">A reference to the container of wall sprites</param>
/// <returns>True if this projectile is currently not in use (i.e. speed is zero).</returns>
bool Projectile::update(double t_dt, 
	                    std::vector<sf::Sprite> const &t_wallSprites)
{
	if (!inUse())
	{
		// If this projectile is not in use, there is no update routine to perform.
		return false;
	}
	
	sf::Vector2f position = m_projectile.getPosition();
	
	const float rotationRads = m_projectile.getRotation() * DEG_TO_RAD;

	float newPosX = position.x + (std::cos(rotationRads) * m_speed) * (t_dt / 1000);
	float newPosY = position.y + (std::sin(rotationRads) * m_speed) * (t_dt / 1000);
	
	m_projectile.setPosition(newPosX, newPosY);

	if (!isOnScreen(newPos)) 
	{
		m_speed = 0;	
	}
	else 
	{
		// Still on-screen, have we collided with a wall?
		for (sf::Sprite const & sprite : t_wallSprites)
		{
			// Checks if the projectile has collided with the current wall sprite.
			if (CollisionDetector::collision(m_projectile, sprite)) 
			{
				m_speed = 0;
			}
		}		
	}
	return m_speed == s_MAX_SPEED;
}