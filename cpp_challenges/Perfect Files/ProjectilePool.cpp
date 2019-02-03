// File: ProjectilePool.cpp
// Line Length ruler.
//--|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|
//       10        20        30        40        50        60        70        80        90        100       110       120
//

/// <summary>
/// @author John Ash
/// @version 1.0
/// 
/// </summary>


#include "ProjectilePool.h"

/// <summary>
/// @brief Creates a projectile.
/// Creates a projectile from the pool of available projectiles.
///  If no projectiles are available, the next in (pool) sequence after
///  the last used projectile is chosen.
/// </summary>
/// <param name="t_texture">A reference to the sprite sheet texture</param>	
/// <param name="t_x">The x position of the projectile</param>
/// <param name="t_x">The y position of the projectile</param>
/// <param name="t_rotation">The rotation angle of the projectile in degrees</param>
void ProjectilePool::create(sf::Texture const & t_texture, 
	                        double t_x, 
	                        double t_y, 
	                        double t_rotation)
{
	// If no projectiles available, simply re-use the next in sequence.
	if (true == m_poolFull)
	{
		m_nextAvailable = (m_nextAvailable + 1) % s_POOL_SIZE;
	}
	
	m_projectiles.at(m_nextAvailable).init(t_texture, t_x, t_y, t_rotation);
}

/// <summary>
/// @brief Updates all projectiles in the pool.
/// Sets an index to the next available projectile. Also sets a 
///  status flag to indicate pool full (all projectiles in use).
/// </summary>
/// <param name="t_dt">The delta time</param>	
/// <param name="t_rotation">A reference to the container of wall sprites</param>
void ProjectilePool::update(double t_dt, 
	                        std::vector<sf::Sprite> const & t_wallSprites)
{	
	// The number of active projectiles.
	int activeCount = 0;
	// Assume the pool is not full initially.
	m_poolFull = false;
	for (int i = 0; i < s_POOL_SIZE; i++)
	{
		if( !m_projectiles.at(i).update(t_dt, t_wallSprites))
		{
			// If this projectile has expired, make it the next available.
			m_nextAvailable = i;
		}
		else
		{
			// So we know how many projectiles are active.
			activeCount++;
		}
	}
	// If no projectiles available, set a flag.
	if (s_POOL_SIZE == activeCount)
	{		
		m_poolFull = true;
	}
}

/// <summary>
/// @brief Draws all active projectiles.
/// </summary>
/// <param name="t_window">The SFML render window</param>	
void ProjectilePool::render(sf::RenderWindow & t_window)
{
	for (int i = 0; i < s_POOL_SIZE; i++)
	{
		// If projectile is active...
		if (m_projectiles.at(i).inUse())
		{
			t_window.draw(m_projectiles.at(i).m_projectile);
		}
	}
}