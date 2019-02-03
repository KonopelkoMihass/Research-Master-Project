// File: Vector2.h
// Line Length ruler.
//--|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|
//       10        20        30        40        50        60        70        80        90        100       110       120
//

/// <summary>
/// @author Pete Lowe
/// @version 1.1
/// 
/// </summary>

#ifndef MY_VECTOR2
#define MY_VECTOR2

#include <SFML/Graphics.hpp>

float vectorLength(const sf::Vector2f t_vector);  // root x2 + y2
float vectorLengthSquared(const sf::Vector2f t_vector); // x2 + y2
sf::Vector2f vectorUnitVector(sf::Vector2f t_vector);// length of ans is one
float vectorCorssProduct(	sf::Vector2f t_vectorA, 
							sf::Vector2f t_vectorB); // Vx * Uy - Vy * Ux
float vectorDotProduct(	sf::Vector2f t_vectorA, 
						sf::Vector2f t_vectorB);   // Vx * Ux + Vy * Uy
float vectorAngleBetween(	sf::Vector2f t_vectorA, 
							sf::Vector2f t_vectorB); // result always 0>= && <=180
float vectorScalarProjection(	sf::Vector2f t_vector, 
								sf::Vector2f t_onto); // scalar resolute

const float PI = 3.14159265359f;

#endif  // MY_VECTOR2