// Inside a Ball Class.
// Responsible for collision update.
updateCollision(dt, playerPaddle, AIPaddle, soundManager)
{
	this.position = this.accelerate(this.x, this.y, this.dx, this.dy, this.acceleration, dt);

	if((this.position.dy > 0) && (this.position.y  > this.maxHeight))
	{
		this.soundManager.playSound('bloop');
		this.position.y = this.maxHeight;
		this.position.dy = -this.position.dy;
	}
	else if ((this.position.dy < 0) && (this.position.y - this.radius < 0))
	{
		this.soundManager.playSound('bloop');
		this.position.y = this.radius;
		this.position.dy = -this.position.dy;
	}
	if ((this.position.dx > 0) && (this.position.x + this.radius > this.maxWidth))
	{
		this.soundManager.playSound('bloop');
		this.position.x = this.maxWidth - this.radius - 5;
		this.createParticles();
		this.position.dx = -this.position.dx;
	}
	else if ((this.position.dx < 0) && (this.position.x - this.radius < 0))
	{
		this.soundManager.playSound('bloop');
		this.position.x = this.radius;
		this.createParticles();
		this.position.dx = -this.position.dx;
	}

	var paddleCollision = this.detectCollision(playerPaddle, this.position.nx, this.position.ny);
	if(!paddleCollision)
	{
		paddleCollision = this.detectCollision(AIPaddle, this.position.nx, this.position.ny);
	}
	if(paddleCollision)
	{
		this.createParticles();
		this.soundManager.playSound('bloop');
		switch(paddleCollision.direction)
		{
		case "left":
			this.position.x = paddleCollision.x;
			this.position.dx = -this.position.dx;
			this.position.dx *= 1.05;
			this.position.dy *= 1.05;
			break;
		case "right":
			this.position.x = paddleCollision.x;
			this.position.dx = -this.position.dx;
			this.position.dx *= 1.05;
			this.position.dy *= 1.05;
			break;
		case "top":
			this.position.y = paddleCollision.y;
			this.position.dy = -this.position.dy;
			var difference = this.position.x - (playerPaddle.x + playerPaddle.scaleWidth / 2);
			var newVel = difference / (playerPaddle.scaleWidth / 2);
			if(playerPaddle.index != this.owner && this.mode != "normal")
			{
				playerPaddle.mode = this.mode;
				this.activate("normal");
			}
			this.position.dx = newVel;
			this.position.dx *= 1.05;
			this.position.dy *= 1.05;
			break;
		case "bottom":
			this.position.y = paddleCollision.y;
			this.position.dy = -this.position.dy;
			var difference = this.position.x - (AIPaddle.x + AIPaddle.scaleWidth / 2);
			var newVel = difference / (AIPaddle.scaleWidth / 2);
			if(AIPaddle.index != this.owner && this.mode != "normal")
			{
				AIPaddle.mode = this.mode;
				this.activate("normal");
			}
			this.position.dx = newVel;
			this.position.dx *= 1.05;
			this.position.dy *= 1.05;
			break;
		}
	}
	this.x = this.position.x;
	this.y = this.position.y;
	this.dx = this.position.dx;
	this.dy = this.position.dy;
}