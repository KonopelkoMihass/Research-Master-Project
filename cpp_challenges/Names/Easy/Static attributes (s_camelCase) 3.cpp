static int outerLoopCount = 0;

for (int i = 0; i < 10; i++)
{
	outerLoopCount++;
	static int s_inForLoopCount;
	s_inForLoopCount++;
	std::cout<< "Inner Count " << s_inForLoopCount << std::endl;
}
std::cout<< "Outer Count " << outerLoopCount << std::endl;


