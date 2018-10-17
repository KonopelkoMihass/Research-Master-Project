// temporarty func to generates enemy based 
// on the asked tipe and level.  To be removed after 
// passedVerification() is tested and integrated.
function generateEnemy(level, tipe)
{
	var enemy = app.factories.enemyFactory.generate(tipe, level);
	if (passedVerification(enemy))
	{
	   return enemy;
	}
	else
	{
		return generateEnemy(level, tipe);
	}
}

// this function checks if the generated enemy 
// is relatively balanced (not overkill or a wimp)
function passedVerification(enemy)
{
	var result=false;
	// internal logic...
	return result;
}