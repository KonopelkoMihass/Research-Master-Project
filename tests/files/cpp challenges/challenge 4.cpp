#include <SFML/Graphics.hpp>

int main()
{
    sf::RenderWindow window(sf::VideoMode(800, 600), "Pengu Smash");
    game Game = new Game();
    while (window.isOpen())
    {
        ...
    }

    return 0;
}