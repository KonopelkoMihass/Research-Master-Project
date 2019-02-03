// A set of files for a monster.
////////////////////////////////////////////////////////////

// File: Monster.h
#ifndef MONSTER_H
#define MONSTER_H

class Monster
{
public:
	Monster();

	void moveTo(Cell t_cell);
	void attack(Cell t_cell);
	void render(RenderWindow & t_window);

private:
	int m_movementSpeed{1};
	int m_healthPoints{100};
	int m_attackDamage{1};
};
#endif // MONSTER_H


////////////////////////////////////////////////////////////
// File: Monster.c

#include "Monster.h"

void Monster::moveTo(Cell t_cell)
{
	// Inner Logic.
}

void Monster::attack(Cell t_cell)
{	
	// Inner Logic.
}

void Monster::render(RenderWindow & t_window)
{
	// Inner Logic.
}