// File: Main.cpp
// Line Length ruler.
//--|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|
//       10        20        30        40        50        60        70        80        90        100       110       120
//

// Doxygen and include statements

int main()
{
	// Setup randomness.
	srand(time(NULL));

	// Creates Window.
	sf::RenderWindow window(sf::VideoMode(800, 600), "Apple Game");
	
	// Represents different Apple Colours
 	enum class AppleColour
    {
        Red = 0, 
        Yellow = 1,
        Green = 2,
    };

	const int NUMBER_OF_APPLES = 10;
	sf::RectangleShape apples[NUMBER_OF_APPLES];

	sf::RectangleShape player;
	
	for (int i = 0; i < NUMBER_OF_APPLES; i++)
	{
		apples[i].setSize(sf::Vector2f(20, 20));
		apples[i].setPosition(	rand() % 780, 
								rand() % 580);
	
		AppleColour colour = static_cast<AppleColour>(rand() % 3);
		
		if (AppleColour::Red == colour)
		{
			apples[i].setFillColor(sf::Color::Red);
		}
		else if (AppleColour::Yellow == colour)
		{
			apples[i].setFillColor(sf::Color::Yellow);
		}
		else if (AppleColour::Green == colour)
		{
			apples[i].setFillColor(sf::Color::Green);
		}
		else
		{
			apples[i].setFillColor(sf::Color::White);
		}
	}

	// Inner logic

	return 0;
}


