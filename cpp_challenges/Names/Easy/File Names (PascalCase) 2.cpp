// A set of files for a cat.
////////////////////////////////////////////////////////////

// File: cat.h
#ifndef CAT_H
#define CAT_H

class Cat
{
public:
	Cat();

	void moveTo(Cell t_cell);
	void attack(Cell t_cell);
	void render(RenderWindow & t_window);

private:
	int m_healthPoints{100};
	int m_attackDamage{1};
	int m_movementSpeed{1};
};
#endif // CAT_H


////////////////////////////////////////////////////////////
// File: Cat.cpp

#include "Cat.h"

void Cat::moveTo(Cell t_cell)
{
	// Inner Logic.
}

void Cat::attack(Cell t_cell)
{	
	// Inner Logic.
}

void Cat::render(RenderWindow & t_window)
{
	// Inner Logic.
}