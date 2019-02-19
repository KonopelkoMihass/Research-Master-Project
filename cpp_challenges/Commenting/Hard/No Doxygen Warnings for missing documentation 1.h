// File: Car.h
// Line Length ruler.
//--|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|
//       10        20        30        40        50        60        70        80        90        100       110       120
//

/// <summary>
/// @author Axel Maxwell
/// @version 1.0
/// 
/// </summary>

#ifndef CAR_H
#define CAR_H

#include "Car.h"
#include "Blueprint.h"

#include <string>

/// <summary>
/// @brief A basic car implementation.
/// 
/// Handles initialization of a car based on the blueprint.  Blueprint will describe
/// the car's properties.
/// </summary>
class Car {
public:

	/// <summary>
	/// @brief No-op default constructor
	/// </summary>
	Car() = default;
	
	/// <summary>
	/// @brief Initializes this car.
	/// The blueprint contains data for the size, type, weight and
	/// other parameters of the car.  The data is set inside this method.
	/// </summary>
	/// <param name="t_blueprint">A reference to the blueprint of a car</param>	
	/// <param name="t_name">name for the car</param>
	void assemble(Blueprint &t_blueprint, 
								std::string t_name);
	
	// More methods

private:

	float m_widthMeters{1.f};
	float m_heightMeters{1.8f};	
	float m_weightKg{750.f};
	
	// More variables.
}
#endif  // CAR_H