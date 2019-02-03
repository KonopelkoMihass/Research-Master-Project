// File: Vector2.h
// Line Length ruler.
//--|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|
//       10        20        30        40        50        60        70        80        90        100       110       120
//

/// <summary>
/// @author Pete Lowe
/// @version 1.3
/// 
/// </summary>

#ifndef MY_VECTOR2_H
#define MY_VECTOR2_H

#include <SFML/Graphics.hpp>

/// <summary>
/// Get length of vector using sqrt of the sum of the squares
/// </summary>
/// <param name="t_vector">Input vector</param>
/// <returns>Length</returns>
float vectorLength(const sf::Vector2f t_vector);

/// <summary>
/// Return length squared may be smaller than length if
///  less than one.
/// </summary>
/// <param name="t_vector">Input vector</param>
/// <returns>Length squared</returns>
float vectorLengthSquared(const sf::Vector2f t_vector); 

/// <summary>
/// Return cross product of 2 vectors
/// </summary>
/// <param name="t_vectorA">Input vector A</param>
/// <param name="t_vectorB">Input vector B</param>
/// <returns>Cross product</returns>
sf::Vector2f vectorUnitVector(sf::Vector2f t_vector);

/// <summary>
/// Return cross product of 2 vectors
/// </summary>
/// <param name="t_vectorA">Input vector A</param>
/// <param name="t_vectorB">Input vector B</param>
/// <returns>Cross product</returns>
float vectorCrossProduct(	sf::Vector2f t_vectorA, 
							sf::Vector2f t_vectorB); 
/// <summary>
/// Return dot product of 2 vectors
/// </summary>
/// <param name="t_vectorA">Input vector A</param>
/// <param name="t_vectorB">Input vector B</param>
/// <returns>Dot product</returns>
float vectorDotProduct(	sf::Vector2f t_vectorA, 
						sf::Vector2f t_vectorB); 

/// <summary>
/// Returns the angle between 2 vectors.
/// </summary>
/// <param name="t_vectorA">Input vector A</param>
/// <param name="t_vectorB">Input vector B</param>
/// <returns>Angle in degrees</returns>
float vectorAngleBetween(	sf::Vector2f t_vectorA, 
							sf::Vector2f t_vectorB); 

/// <summary>
/// Returns the vector rotated by radians.
/// </summary>
/// <param name="t_vector">Input vector</param>
/// <param name="t_angleRadians">Rotation degree in radians</param>
/// <returns>Rotated input vector</returns>
sf::Vector2f vectorRotateBy(const sf::Vector2f t_vector, 
							const float t_angleRadians);

/// <summary>
/// Returns the unit vector.
/// </summary>
/// <param name="t_vector">Input vector</param>
/// <returns>Unit vector</returns>
sf::Vector2f vectorUnitVector(sf::Vector2f t_vector);

/// PI number used in vector calculations.
const float PI = 3.14159265359f;

#endif  // MY_VECTOR2_H