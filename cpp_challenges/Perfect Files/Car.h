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
	
	/// <summary>
	/// @brief Speeds up the car.
	/// Based on the tires, road and engine it will accelerate the car.
	/// </summary>
	void speedUp();
	
	/// <summary>
	/// @brief Slows down the car.
	/// Based on the current speed, tires, road and brakes it will decelerate the car.
	/// </summary>
	void slowDown();
	
	// More methods

private:

	/// Width of the car in meters.
	float m_widthMeters{1.f};
	
	/// Height of the car in meters.
	float m_heightMeters{1.8f};
		
	/// Weight of the car in kilograms.
	float m_weightKg{750.f};
	
	/// Number of seats
	int m_seatsNumber{2};

	/// Maximum speed in kilometers per hour.
	int m_maxSpeedKph{60};
	
	/// Type of the car.
	std::string m_type{"Toycar"};
	
	/// Name of the car.
	std::string m_name{"Carl"};
}
#endif  // CAR_H