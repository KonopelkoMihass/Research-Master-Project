// A small class
#ifndef APPLE_H
#define APPLE_H

#include "Physics/Global.h"

class Pomme
{
public:
    Pomme(Vector2 t_position, Vector2 t_direction);
    ~Pomme();
    void draw();
    Vector2 getPosition();

private:
    Vector2 m_position;
    Vector2 m_direction;
};

#endif // APPLE_H