#include <SFML/Graphics.hpp>
#include "Game.h"

int main()
{
    sf::RenderWindow window(sf::VideoMode(800, 600), "Pengu Smash");
    game = new Game();
    while (window.isOpen())
    {
        ...
    }

    return 0;
}