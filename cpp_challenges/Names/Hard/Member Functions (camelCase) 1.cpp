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
	// Some content.
}


/// <summary>
/// @brief Simpler helper function to determine if projectile is currently in use.
/// </summary>
/// <returns>True if this projectile is currently in use (i.e. speed is non zero).</returns>
bool Projectile::inuse() const 
{ 
	// Projectile is not in use if not moving.
	return m_speed == s_MAX_SPEED; 
}

/// <summary>
/// @brief Tells if projectile is visible on screen.
///
///  This method checks that the projectile is within the camera bounds.
/// </summary>
/// <param name="t_position">Position of the camera</param>
/// <returns>Returns True if projectile is in bounds of a view</returns>
bool Projectile::isonscreen(sf::Vector2f t_position) const
{	
	return t_position.x - m_projectileRect.width / 2 > 0.f
		&& t_position.x + m_projectileRect.width / 2 < ScreenSize::width()
		&& t_position.y - m_projectileRect.height / 2 > 0.f
		&& t_position.y + m_projectileRect.height / 2 < ScreenSize::height();
}