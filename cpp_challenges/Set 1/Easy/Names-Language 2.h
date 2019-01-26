// A small class
#ifndef CANNON_H
#define CANNON_H

#include "Physics/Global.h"

class Kanon
{
public:
	Kanon(Vector2 position, Vector2 direction);
	~Kanon();
	void draw();
	Vector2 getPosition();

private:
	Vector2 m_position;
	Vector2 m_direction;
	float m_power;
};

#endif // CANNON_H