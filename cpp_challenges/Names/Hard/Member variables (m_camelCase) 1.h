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


#pragma once
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

public:
	/// <summary>
	/// @brief No-op default constructor
	/// </summary>
	Projectile() = default;

	// Some in-between content.
	
	/// <summary>
	/// @brief Simpler helper function to determine if projectile is currently in use.
	/// </summary>
	/// <returns>True if this projectile is currently in use (i.e. speed is non zero).</returns>
	bool inUse() const;

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
	double speed { s_MAX_SPEED };

	/// A sprite for the projectile.
	sf::Sprite projectile;

	/// The bounding rectangle for this projectile.
	sf::IntRect projectileRect { 5, 178, 10, 6 };

};