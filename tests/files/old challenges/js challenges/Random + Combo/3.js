
class Map
{
	constructor 
	{
		//...
	}

	// This method calculate the range between 2 points
	RangeBetween(start, end) 
	{
		var passable = this.IsPassable(start, end);
		
		if(!passable)
		{
			return [];
		}
		
		var pathCells = this.AStarPathfind(start, end);
		return pathCells;
	}
}
