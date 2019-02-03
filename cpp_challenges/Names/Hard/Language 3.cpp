// File: ProjectilePool.h
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

////////////////////////////////////////////////////////////
void ProjectilePool::opdateer(double t_dt, 
                            std::vector<sf::Sprite> const & t_wallSprites)
{    
    // The number of active projectiles.
    int activeCount = 0;
    // Assume the pool is not full initially.
    m_poolPolon = false;
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
        m_poolPolon = true;
    }
}

////////////////////////////////////////////////////////////
void ProjectilePool::lewer(sf::RenderWindow & t_window)
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