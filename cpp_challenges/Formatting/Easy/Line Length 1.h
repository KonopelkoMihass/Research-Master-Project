// Line Length ruler.
//--|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|
//       10        20        30        40        50        60        70        80        90        100       110       120
//

Enemy generateEnemy(int t_healthPoints, int t_movementSpeed, int t_minimumDamage, int t_dieSides, int t_armor, string t_name)
{
	// Inner logic.
}


// Somewhere in a game
Enemy dungeonPrince = generateEnemy(randomInt(15, 21), randomInt(5, 7), randomInt(7, 12), 12, 
									randomInt(11, 19), generateCoolMonsterName()) )

Enemy dungeonKing = generateEnemy(randomInt(15, 21)				// Health
								,randomInt(5, 7)				// Movement
								,randomInt(7, 12)				// Min. damage
								,12								// Die type (d4, d6, d8, d10, d12, d20)
								,randomInt(11, 19)				// Armour
								,generateCoolMonsterName()));	// Name


