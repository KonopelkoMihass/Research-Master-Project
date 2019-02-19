// File: Projectile.h
// Line Length ruler.
//--|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|
//       10        20        30        40        50        60        70        80        90        100       110       120
//

/// <summary>
/// @author John Ash
/// @version 1.0
/// 
/// </summary>

#ifndef PROJECTILE_H
#define PROJECTILE_H
#include <SFML/Graphics.hpp>
#include "ScreenSize.h"
#include "MathUtility.h"
#include "CollisionDetector.h"

/// <summary>
/// @brief A basic projectile implementation.
/// 
/// Handles initialisation and updating of projectiles.
/// </summary>
class Projectile
{
	/// Allows the ProjectilePool direct access to the private members of Projectile.
	/// This is so the ProjectilePool can access the Projectile sprite representation so it
	/// can be rendered.
	friend class ProjectilePool;
	
	private:
	/// <summary>
	/// @brief Tells if projectile is visible on screen.
	///
	///  This method checks that the projectile is within the camera bounds.
	/// </summary>
	/// <param name="t_position">Position of the camera</param>
	/// <returns>True if projectile is in bounds of a view</returns>
	bool Projectile::isOnScreen(sf::Vector2f position) const;

	/// Max. update speed 
	static constexpr double s_MAX_SPEED { 1000.0 };

	/// Movement speed.
	double m_speed { s_MAX_SPEED };

	/// A sprite for the projectile.
	sf::Sprite m_projectile;

	/// The bounding rectangle for this projectile.
	sf::IntRect m_projectileRect { 5, 178, 10, 6 };
	
public:
	/// <summary>
	/// @brief No-op default constructor
	/// </summary>
	Projectile() = default;

	/// <summary>
	/// @brief Initialises various properties of the projectile.
	/// The projectile speed is set to it's maximum allowable speed.
	/// </summary>
	/// <param name="t_texture">A reference to the sprite sheet texture</param>	
	/// <param name="t_x">The x position of the projectile</param>
	/// <param name="t_x">The y position of the projectile</param>
	/// <param name="t_rotation">The rotation angle of the projectile in degrees</param>
	void init(sf::Texture const & t_texture, 
		      double t_x, 
		      double t_y, 
		      double t_rotation);

	// More methods.
};

#endif // !PROJECTILE_H