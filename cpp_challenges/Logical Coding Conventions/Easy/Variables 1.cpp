int main()
{
	// Inner logic
	while (window.isOpen())
	{
		// check if the close window button is clicked on.
		sf::Event event;
		while (window.pollEvent(event))
		{
			if (event.type == sf::Event::Closed)
			{
				window.close();
			}
		}

		// add to the time since last update and restart the clock
		timeSinceLastUpdate += clock.restart();

		// update every 60th of a second
		// only when the time since last update is greater than 1/60 update the world.

		
		if (timeSinceLastUpdate > timePerFrame)
		{
			int a = 0;
			int b = 0;
			
			// get keyboard input.
			if (sf::Keyboard::isKeyPressed(sf::Keyboard::Left))
			{
				a-= 5;
			}
			if (sf::Keyboard::isKeyPressed(sf::Keyboard::Right))
			{
				a+= 5;
			}
			if (sf::Keyboard::isKeyPressed(sf::Keyboard::Up))
			{
				b-= 5;
			}
			if (sf::Keyboard::isKeyPressed(sf::Keyboard::Down))
			{
				b+= 5;
			}
			
			player.move(a, b);
			
	
			for (b = 0; b < NUMBER_OF_APPLES; b++)
			{
				apples[b].move(rand() % 7-3, rand() % 7-3);
				
				if (apples[b].getGlobalBounds().intersects(player.getGlobalBounds()))
				{
					apples[b].setPosition(-1000, -1000);
				}
			}
			
			// More logic.
		}
	}
	return 0;
}


