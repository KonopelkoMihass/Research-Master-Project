// Additional maths functions.
class MathsX
{

	Median(numbers) 
	{
		var result = 0, 			
			total = numbers.length; // numbers total
	 
		numbers.sort();
	 
		if (total % 2 == 0)
		{
			result= (numbers[total / 2 - 1] + numbers[total / 2]) / 2;
		}
		else
		{
			result = numbers[(total - 1) / 2]
		}
		return result;
	}
}