// File: Projectile.cpp
// Line Length ruler.
//--|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|
//       10        20        30        40        50        60        70        80        90        100       110       120
//

/// <summary>
/// @author John Ash
/// @version 1.0
/// 
/// </summary>

#include "Projectile.h"

/// <summary>
/// @brief Initialises various properties of the projectile.
/// The projectile speed is set to it's maximum allowable speed.
/// </summary>
/// <param name="t_texture">A reference to the sprite sheet texture</param>	
/// <param name="t_x">The x position of the projectile</param>
/// <param name="t_x">The y position of the projectile</param>
/// <param name="t_rotation">The rotation angle of the projectile in degrees</param>
void Projectile::init(sf::Texture const & t_texture, 
	                  double t_x, 
	                  double t_y, 
	                  double t_rotation)
{	
	// Set texture
	m_projectile.setTexture(t_texture);
	m_projectile.setTextureRect(m_projectileRect);
	
	m_projectile.setOrigin( m_projectileRect.width / 2.0,
							m_projectileRect.height / 2.0);
						
	m_projectile.setPosition(t_x, t_y);
	
	m_projectile.setRotation(t_rotation); 
	m_speed = s_MAX_SPEED;
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
bool Projectile::update(double t_dt, std::vector<sf::Sprite> const &t_wallSprites)
{
  
	// Some inner logic.
  
	return m_speed == s_MAX_SPEED;
}

