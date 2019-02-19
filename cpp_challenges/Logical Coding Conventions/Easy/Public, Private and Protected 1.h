#ifndef CAT_H
#define CAT_H

// Includes and more documents

struct Cat
{
private:
	/// Cat's health.
	int health{9};
	
	/// Hunger State.
	std::string hunger{"Starving"};


public:
	/// Constructor
	Cat();
	
	/// Position on X-axis.
	double x{0};
	/// Position on Y-axis.
	double y{0};
	/// Position on Z-axis.
	double z{0};
	
};

#endif // !CAT_H