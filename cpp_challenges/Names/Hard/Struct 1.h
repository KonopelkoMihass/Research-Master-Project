// File: Position.h
// Line Length ruler.
//--|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|
//       10        20        30        40        50        60        70        80        90        100       110       120
//

/// <summary>
/// @author Ash Smith
/// @version 1.0
/// 
/// </summary>

#ifndef POSITION_H
#define POSITION_H

/// <summary>
/// @brief A basic position struct.
/// 
/// Stores position on x, y, z axises.
/// </summary>
struct Position
{
public:
	/// <summary>
	/// @brief No-op default constructor
	/// </summary>
	Position() = default;

	/// <summary>
	/// @brief Sets X-axis.
	/// </summary>
	/// <param name="t_x">an X value</param>	
	void setX(double t_x);

	/// <summary>
	/// @brief Sets Y-axis.
	/// </summary>
	/// <param name="t_x">an X value</param>	
	void setY(double t_x);

	/// <summary>
	/// @brief Sets Z-axis.
	/// </summary>
	/// <param name="t_x">an X value</param>	
	void setZ(double t_x);

	// More methods here.

private:
	/// Position on X-axis.
	double m_x{0};
	/// Position on Y-axis.
	double m_y{0};
	/// Position on Z-axis.
	double m_z{0};


};

#endif // !POSITION_H