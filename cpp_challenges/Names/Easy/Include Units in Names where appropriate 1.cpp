#include <iostream>
using namespace std;

int main()
{    
	// Kilometers walked
	float walked{0};

	// Time spent in hours
	float timeSpentHrs{0};


	cout << "Enter distance walked: ";
	cin >> walked;

	cout << "Enter time spent: ";
	cin >> timeSpentHrs;

	cout << "You walked " << walked << " kilometers in "<< timeSpentHrs <<" hours" << endl;    
	return 0;
}