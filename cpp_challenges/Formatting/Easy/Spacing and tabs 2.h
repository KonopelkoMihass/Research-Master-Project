// This method increments some static variables

static int s_outerLoopCount = 0;
for (int i=0; i < 10; i++)
{
	static int s_inForLoopCount;
	s_inForLoopCount++;
	
	s_outerLoopCount ++;
	std::cout<< "Inner Count " << s_inForLoopCount << std::endl  ;
}
std::cout<< "Outer Count " << s_outerLoopCount << std::endl;


