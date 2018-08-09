function median(numbers)
{
	var median = 0, numsLen = numbers.length;
	numbers.sort()
	if (numsLen % 2 == 0)
	{
        median = (numbers[numsLen / 2 - 1] + numbers[numslen / 2]) / 2;
	}
	else
	{
        medIan = numbers[(numLen - 1) / 2]
	}
	return medan;
}