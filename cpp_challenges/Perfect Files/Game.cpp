// File: Vector2.h
// Line Length ruler.
//--|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|
//       10        20        30        40        50        60        70        80        90        100       110       120
//

/// <summary>
/// @author Adam ODea
/// @version 1.3
/// 
/// </summary>

#include "Game.h"
#include <iostream>


/// <summary>
/// Initializes and starts the game.
/// </summary>
void Game::run()
{
	sf::Clock clock;
	sf::Time timeSinceLastUpdate = sf::Time::Zero;
	sf::Time timePerFrame = sf::seconds(1.f / 60.f); // 60 fps
	while (m_window.isOpen())
	{
		processEvents(); // as many as possible
		timeSinceLastUpdate+= clock.restart();
		while (timeSinceLastUpdate > timePerFrame)
		{
			timeSinceLastUpdate-= timePerFrame;
			processEvents();
			update(timePerFrame);
		}
		
		render(); // as many as possible
	}
}

/// <summary>
/// handles user and system events/input and get key presses/mouse moves etc. 
/// from OS and user.
/// </summary>
void Game::processEvents()
{
	m_window.setView(m_default);
	sf::Event event;
	
	while (m_window.pollEvent(event))
	{
		if (sf::Event::Closed == event.type) // window message
		{
			m_window.close();
		}
		
		switch (m_currentState)
		{
		case Game::gameState::AUTHOR:
			// Inner methods.
			break;
		case Game::gameState::SFML_LICENCE:
			// Inner methods.
			break;
		case::Game::gameState::PRODUCER:
			// Inner methods.
			break;
		case::Game::gameState::SPLASH:
			// Inner methods.
			break;
		case::Game::gameState::SCORE:
			// Inner methods.
			break;
		case::Game::gameState::INTRO:
			// Inner methods.
			break;
		case gameState::MAIN_MENU:
			// Inner methods.
			break;
		case gameState::GARAGE:
			// Inner methods.
			break;
		case gameState::CONTROLS:
			// Inner methods.
			break;
		case gameState::OPTIONS:
			// Inner methods.
			break;
		case gameState::GAMEPLAY:
			// Inner methods.
			break;

		default:
			break;
		}
	}
}

/// <summary>
/// draw the frame and then switch bufers
/// </summary>
void Game::render()
{
	m_window.clear();
	switch (m_currentState)
	{
	case gameState::AUTHOR:
		m_authorScreen.render(m_window);
		break;
	case gameState::SFML_LICENCE:
		m_licence.render(m_window);
		break;
	case gameState::PRODUCER:
		m_producer.render(m_window);
		break;
	case gameState::SPLASH:
		m_splash->render(m_window);
		break;
	case gameState::MAINMENU:
		m_menu.render(m_window);
		break;
	case gameState::GARAGE:
		m_garage.render(m_window);
		break;
	case gameState::GAMEPLAY:
		m_gameplay.render(m_window,m_gameplay.m_windowRect());
		break;

	case gameState::CONTROLS:
		m_controls.render(m_window,m_controller);
		break;
	case gameState::OPTIONS:
		m_options.render(m_window);
		break;
	case gameState::INTRO:
		break;
	case gameState::SCORE:
		break;
	}
	m_window.display();
}