// temporarty func to generates enemy based 
// on the asked tipe and level.  To be removed after 
// passedVerification(enemy) is tested and integrated.
function generateEnemy(Level, Type)
{
	var enemy = app.factories.enemyFactory.generate(Level, Type);
	if (passedVerification(enemy))
	{
	   return enemy;
	}
	else
	{
		return generateEnemy(Level, Type);
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