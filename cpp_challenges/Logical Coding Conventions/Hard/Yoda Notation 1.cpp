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
		// Inside logic
	}

	// If no projectiles available, set a flag.
	if (activeCount == s_POOL_SIZE)
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