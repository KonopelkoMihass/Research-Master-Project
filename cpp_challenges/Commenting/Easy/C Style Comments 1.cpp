// Fibonacci Series code

#include <iostream>

int main()
{
	int numberOfTerms = 0;
	int term1 = 0;
	int term2 = 1;
	int nextTerm = 0;

	// User will specify number of terms to do.
	std::cout << "Enter the number of terms: ";
	std::cin >> numberOfTerms;

	std::cout << "Fibonacci Series: ";

	/*Loops for the number of terms set by user.*/
	for (int i = 1; i <= numberOfTerms; ++i)
	{
		// Prints the first two terms once each time.
		if(i == 1)
		{
			std::cout << " " << term1;
			continue;
		}

		if(i == 2)
		{
			std::cout << term2 << " ";
			continue;
		}

		nextTerm = term1 + term2;
		term1 = term2;
		term2 = nextTerm;

		std::cout << nextTerm << " ";
	}
	return 0;
}
