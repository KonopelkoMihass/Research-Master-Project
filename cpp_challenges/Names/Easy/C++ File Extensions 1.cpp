// A set of files for Projectille Pool.
////////////////////////////////////////////////////////////

// File: ProjectilePool.js
#ifndef PROJECTILE_POOL_H
#define PROJECTILE_POOL_H

#include <array>
#include "Projectile.h"

class ProjectilePool
{
public:
	ProjectilePool();

	void create(double t_x, double t_y, double t_rotation);
	void update(float t_delta);
	void render(RenderWindow & t_window);

private:
	// Some private variables
};
#endif // PROJECTILE_POOL_H


////////////////////////////////////////////////////////////
// File: ProjectilePool.cpp

#include "ProjectilePool.h"

void ProjectilePool::create(double t_x, double t_y, double t_rotation)
{
	// Inner Logic.
}

void ProjectilePool::update(float t_delta)
{	
	// Inner Logic.
}

void ProjectilePool::render(RenderWindow & t_window)
{
	// Inner Logic.
}