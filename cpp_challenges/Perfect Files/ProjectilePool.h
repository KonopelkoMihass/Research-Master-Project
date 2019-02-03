// File: ProjectilePool.h
// Line Length ruler.
//--|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|
//       10        20        30        40        50        60        70        80        90        100       110       120
//

/// <summary>
/// @author Ash Snow
/// @version 1.0
/// 
/// </summary>


#pragma once
#include <SFML/Graphics.hpp>
#include <array>
#include "Projectile.h"

class ProjectilePool
{
public:

	/// <summary>
	/// @brief No-op default constructor
	/// </summary>
	ProjectilePool() = default;

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
	void create(sf::Texture const & t_texture, 
		        double t_x, 
		        double t_y, 
		        double t_rotation);

	/// <summary>
	/// @brief Updates all projectiles in the pool.
	/// Sets an index to the next available projectile. Also sets a 
	///  status flag to indicate pool full (all projectiles in use).
	/// </summary>
	/// <param name="t_dt">The delta time</param>	
	/// <param name="t_rotation">A reference to the container of wall sprites</param>
	void update(double t_dt,  
		        std::vector<sf::Sprite> const & t_wallSprites);

	/// <summary>
	/// @brief Draws all active projectiles.
	/// </summary>
	/// <param name="t_window">The SFML render window</param>	
	void render(sf::RenderWindow & t_window);


private:
	/// The total of projectiles allowed.
	static const int s_POOL_SIZE = 100;

	/// A container for the projectiles.
	std::array<Projectile, s_POOL_SIZE> m_projectiles;

	/// The index of the next available projectile.
	int m_nextAvailable { 0 };

	/// A flag indicating whether there are any projectiles available (initially they are).
	bool m_poolFull { false };
};