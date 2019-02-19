// Calculate miss chance
bool missed = !accuracyCheck();

// Which of these 2 statements is wrong?

if (missed == false) // if not missed
{
	// Logic
}

// OR

if (!missed) // if not missed
{
	// Logic
}