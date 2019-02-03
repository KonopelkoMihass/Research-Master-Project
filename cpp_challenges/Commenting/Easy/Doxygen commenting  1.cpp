// Small lab file with doxygen comments.

#include <iostream>
#include <math.h> 

/// PI is generated via calling the math library.
const double PI = acos(-1.0f);

/// <summary>
//	This function converts degrees into radians. 
/// </summary>
/// <param name="degrees">A degree angle.</param>
/// <returns> A radian angle</returns>
double deg2rad(double degrees);



// <summary>
///	This is a main loop of the program
/// </summary>
int main() {
	double degrees = 0;

	std::cout << "Angle To Convert: ";
	std::cin >> degrees;

	std::cout << "Radians: " << deg2rad(degrees) << std::endl;
	system("PAUSE");
}

double deg2rad(double degrees) 
{ 
	return degrees * PI / 180;
}