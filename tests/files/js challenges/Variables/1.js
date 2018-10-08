var mapBuilder = new MapBuiledr();
// This class is responsible for building
// 3 dimensional isometric tile map.
class MapBuilder
{
	// This generates a new map
	generateNewMap(x, y, z, difficulty)
	{
		var map; // will store a generated map
		
		// pass size data to a terrain generator
		map = this.generateTerrain(x, y, z);
		
		// add moster spawns based on difficulty and size data
		map = this.spawnMonsters(map, difficulty);
		
		// check if map is passable.  If fails, generate a new map.
		if(this.mapIsPassable(map))
		{
			return map;
		}
		else
		{
			return this.generateNewMap(x, y, z, difficulty);
		}
	}
	
	spawnMonsters(map, difficulty)
	{
		//... logic
	}
}