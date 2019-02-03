// File: Vector2.cpp
// Line Length ruler.
//--|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|
//       10        20        30        40        50        60        70        80        90        100       110       120
//
#include "Vector2.h"

/// <summary>
/// @author Peter Kapusta
/// @version 1.2
/// 
/// </summary>

// Few function skipped

/// <summary>
/// Return cross product of 2 vectors
/// </summary>
/// <param name="t_vectorA">Input vector A</param>
/// <param name="t_vectorB">Input vector B</param>
/// <returns>Cross product</returns>
float vectorCrossProduct(	const sf::Vector2f t_vectorA, 
													const sf::Vector2f t_vectorB)
{
	const float result = (t_vectorA.x * t_vectorB.y) - (t_vectorA.y * t_vectorB.x);
	return result;	
}

/// <summary>
/// Return dot product of 2 vectors
/// </summary>
/// <param name="t_vectorA">Input vector A</param>
/// <param name="t_vectorB">Input vector B</param>
/// <returns>Dot product</returns>
float vectorDotProduct(	const sf::Vector2f t_vectorA, 
												const sf::Vector2f t_vectorB)
{
	const float result = t_vectorA.x * t_vectorB.x + t_vectorA.y * t_vectorB.y;
	return result;
}


/// <summary>
/// Returns the angle between 2 vectors.
/// </summary>
/// <param name="t_vectorA">Input vector A</param>
/// <param name="t_vectorB">Input vector B</param>
/// <returns>Angle in degrees</returns>
float vectorAngleBetween(	const sf::Vector2f t_vectorA, 
													const sf::Vector2f t_VectorB)
{
	float cosine = vectorDotProduct(vectorUnitVector(t_vectorA), vectorUnitVector(t_VectorB));
	if (cosine > 1.0f)
	{
		cosine = 1.0f;
	}
	if (cosine < -1.0f)
	{
		cosine = -1.0f;
	}

	const float angleInDegrees = std::acos(cosine) * 180.0f / PI;
	return angleInDegrees;
}

/// <summary>
/// Returns the vector rotated by radians.
/// </summary>
/// <param name="t_vector">Input vector</param>
/// <param name="t_angleRadians">Rotation degree in radians</param>
/// <returns>Rotated input vector</returns>
sf::Vector2f vectorRotateBy(const sf::Vector2f t_vector, 
														const float t_angleRadians)
{
	const float cos = std::cos(t_angleRadians); 
	const float sin = std::sin(t_angleRadians);

	return (sf::Vector2f((t_vector.x * cos) - (t_vector.y * sin), 
											(t_vector.x * sin) + (t_vector.y * cos)));
}


