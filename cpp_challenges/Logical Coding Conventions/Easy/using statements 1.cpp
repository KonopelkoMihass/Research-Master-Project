#include <iostream>     
#include <time.h>       

using namespace std;
int main() 
{ 
	srand (time(NULL));
	int result = rand() % 3 + 1;
	
	switch (result)
	{
		case 1:
			cout << "Result is 1" << endl;
			break;
		case 2:
			cout << "Result is 2" << endl;
			break;
		case 3:
			cout << "Result is 3" << endl;
			break;
		default:
			cout << "Result is something" << endl;
			break;
	}
  
   return 0; 
}  