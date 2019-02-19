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
	if (inUse() == false)
	{
		// If this projectile is not in use, there is no update routine to perform.
		return false;
	}
	
	sf::Vector2f position = m_projectile.getPosition();
	
	const float rotationRads = m_projectile.getRotation() * DEG_TO_RAD;

	float newPosX = position.x + (std::cos(rotationRads) * m_speed) * (t_dt / 1000);
	float newPosY = position.y + (std::sin(rotationRads) * m_speed) * (t_dt / 1000);
	
	m_projectile.setPosition(newPosX, newPosY);

	if (isOnScreen(newPos) == false) 
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
