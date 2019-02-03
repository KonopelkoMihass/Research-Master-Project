// File: Vector2.cpp
// Line Length ruler.
//--|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|
//       10        20        30        40        50        60        70        80        90        100       110       120
//
#include "Vector2.h"

/// <summary>
/// @author Pete Lowe
/// @version 1.2
/// 
/// </summary>


/// <summary>
/// Get length of vector using sqrt of the sum of the squares
/// </summary>
/// <param name="t_vector">Input vector</param>
/// <returns>Length</returns>
float vectorLength(const sf::Vector2f t_vector)
{
	float sumOfSquares = (t_vector.x * t_vector.x ) + (t_vector.y * t_vector.y);
	const float length = sqrt(sumOfSquares);
	return length;
}

/// <summary>
/// Return length squared may be smaller than length if
///  less than one.
/// </summary>
/// <param name="t_vector">Input vector</param>
/// <returns>Length squared</returns>
float vectorLengthSquared(const sf::Vector2f t_vector)
{
	const float sumOfSquares = (t_vector.x * t_vector.x) + (t_vector.y * t_vector.y);	
	return sumOfSquares;
}

/// <summary>
/// Return cross product of 2 vectors
/// </summary>
/// <param name="t_vectorA">Input vector A</param>
/// <param name="t_vectorB">Input vector B</param>
/// <returns>Cross product</returns>
float vectorCorssProduct(	const sf::Vector2f t_vectorA, 
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
	const float result = (t_vectorA.x * t_vectorB.x) + (t_vectorA.y * t_vectorB.y);
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
	const float angleInRadians = std::acos(cosine);
	const float  angleInDegrees = angleInRadians * (180.0f / PI);
	return angleInDegrees;
}

/// <summary>
/// Returns the vector rotated by radians.
/// </summary>
/// <param name="t_vector">Input vector</param>
/// <param name="t_angleRadians">Rotation degree in radians</param>
/// <returns>Rotated input vector</returns>
sf::Vector2f vectorRotateBy(const sf::Vector2f t_vector, const float t_angleRadians)
{
	const float cos = std::cos(t_angleRadians); 
	const float sin = std::sin(t_angleRadians);
	const float xComponent = (t_vector.x * cos) - (t_vector.y * sin);
	const float yComponent = (t_vector.x * sin) + (t_vector.y * cos);
	const sf::Vector2f result{ xComponent, yComponent };
	return result;
}


/// <summary>
/// Returns the unit vector.
/// </summary>
/// <param name="t_vector">Input vector</param>
/// <returns>Unit vector</returns>
sf::Vector2f vectorUnitVector(sf::Vector2f t_vector)
{
	sf::Vector2f result{0.0f, 0.0f};
	const float lenght = vectorLength(t_vector);
	if (lenght != 0.0f) 
	{
		result = sf::Vector2f{ t_vector.x / lenght, t_vector.y / lenght };
	}
	return result;
}
