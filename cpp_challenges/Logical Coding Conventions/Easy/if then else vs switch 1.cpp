#include <stdio.h>      
#include <stdlib.h>     
#include <time.h>       

int main() 
{ 
	srand (time(NULL));
	int result = rand() % 3 + 1;
	
	if (result == 1)
	{
		printf("Result is 1"); 
	}
	else if (result == 2)
	{
		printf("Result is 2"); 
	}
	else
	{
		printf("Result is 3"); 
	}

  
   return 0; 
}  