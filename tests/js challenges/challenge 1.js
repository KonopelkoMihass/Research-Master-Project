function test()
{
	var money$ = 0;
   var health = 100;
	var movementSpeed = 20;
	var attdamage = 1;
	var const_name = "Veloceraptor";
	
	var result = simulateCardio(health, movementSpeed)
	if (result == "heart attack") 
	{
		console.log("rip");
	}
}