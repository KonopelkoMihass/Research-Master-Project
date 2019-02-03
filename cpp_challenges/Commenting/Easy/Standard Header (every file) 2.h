/// <summary>
/// @author Peter Lowe
/// 
/// This is a game class a Cyberpark 1986.
/// </summary>

#ifndef GAME_H
#define GAME_H

class Game
{
public:
	Game();
	~Game();

	void run();

private:
	void processEvents();
	void update(sf::Time t_deltaTime);
	void render();
	
	// And more methods.
};

#endif // !GAME_H