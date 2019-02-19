// An important if statement section.

int machineState = this.m_aiCore->getState();

// Although Switch case would have been better - can't go against the order!

if (machineState == AI_ATTACK) 
{
	// do something.
}

else if (AI_FLEE == machineState)
{
	// do something.
}

else if (machineState == AI_CHARGE)
{
	// do sometihng again.
}