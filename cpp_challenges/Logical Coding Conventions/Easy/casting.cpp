#include <iostream>

 
main() 
{
   double doubleVariable = 1.007;
   float floatVariable = 21.7f;
   
   int castOne = (int) doubleVariable;
   std::cout << "Line 1 - Value of (int) doubleVariable is :" << castOne << std::endl;
   
   int castTwo = static_cast<int>(floatVariable);
   std::cout << "Line 2 - Value of static_cast<int>(floatVariable) is  :" << castTwo << std::endl;
   
   return 0;
}