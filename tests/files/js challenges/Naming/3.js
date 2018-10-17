// temporarty func to generates enemy based 
// on the asked tipe and level.  To be removed after 
// passedVerification(enemy) is tested and integrated.
function GenerateEnemy(level, type)
{
	var enemy = app.factories.enemyFactory.generate(type, level);
	if (passedVerification(enemy))
	{
	   return enemy;
	}
	else
	{
		return generateEnemy(level, type);
	}
}

// this function checks if the generated enemy 
// is relatively balanced (not overkill or a wimp)
function PassedVerification(enemy)
{
	var result=false;
	// internal logic...
	return result;
}