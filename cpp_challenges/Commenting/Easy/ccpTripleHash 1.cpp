// Small lab file with doxygen comments.  
// Select method with the issue.

#include <iostream>
#include <math.h> 

/// PI is generated via calling the math library.
const double PI = acos(-1.0f);

/// <summary>
///	This function converts degrees into radians. 
/// </summary>
/// <returns> A radian angle</returns>
double deg2rad(double degrees);

/// <summary>
///	This function converts radians to degrees. 
/// </summary>
/// <param name="degrees">A degree angle.</param>
/// <returns> A radian angle</returns>
double rad2deg(double radians);


/// <summary>
///	This is a main loop of the program
/// </summary>
int main() {
	double degrees = 0;
	double radians = 0;

	std::cout << "Angle To Convert: ";
	std::cin >> degrees;
	
	radians = deg2rad(degrees);
	std::cout << "Radians: " << deg2rad(degrees) << std::endl;
	std::cout << "Degrees: " << rad2deg(radians) << std::endl;
	
	system("PAUSE");
}

double deg2rad(double degrees) 
{ 
	return degrees * PI / 180;
}

double rad2deg(double radians) 
{ 
	return rad * 180/PI;
}
