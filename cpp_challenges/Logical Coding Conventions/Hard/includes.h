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

#include "SFML/Graphics.hpp"

#include "ScreenSize.h"
#include "MathUtility.h"
#include <CollisionDetector.h>

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
	// Public variables and methods.

private:
	// Private variables and methods.

};

#endif // !PROJECTILE_H