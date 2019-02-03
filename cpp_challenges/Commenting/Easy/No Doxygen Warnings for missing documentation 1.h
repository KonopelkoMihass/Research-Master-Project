/// @brief The class for a space enemy.
///
/// This class represents a flying saucer enemy.
/// It can fly over map and shoot at the player 
/// buildings.
class SpaceAlien{
public:
	/// <summary>
	/// @brief default constructor
	/// </summary>
	SpaceAlien()
	/// <summary>
	/// @brief overloaded constructor
	/// </summary>
	/// <param name="t_x">X Position</param>
	/// <param name="t_y">Y Position</param>
	/// <param name="t_z">Z Position</param>
	SpaceAlien( float t_x,
				float t_y,
				float t_z);
		
	/// <summary>
	/// @brief moves the alien in that direction.
	/// 
	/// this method causes alien to move 1 cell at 
	/// a time based on the direction string.  If 
	/// string does not match options available, it will assert.
	/// </summary>
	/// <param name="t_direction">represents a 2 character string e.g "NN", "SE"</param>
	void move(std::string t_direction);
	void attack();

  
private: 
	/// X position in the 3d space.
	float m_x{0};
	/// Y position in the 3d space.
	float m_y{0};
	/// Z position in the 3d space.
	float m_z{0};
	/// The health of the Alien.  Dies if 0 or lower.
	int m_health{100};
	/// Attack damage Alien deals per turn.
	int m_attkDamage{9001};
	bool m_alive;
};

