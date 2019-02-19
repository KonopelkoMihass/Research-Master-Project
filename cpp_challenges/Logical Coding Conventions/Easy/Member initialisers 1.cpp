// There are few constructor calls.


Shuffleboard::Shuffleboard(SceneManager *t_sceneMan) :
	m_sceneManager(sceneMan) 
{
	// More inner logic.
}

Cat::Cat(int t_x, 
		int t_y, 
		int t_z)
{
	m_x = t_x;
	m_y = t_y;
	m_z = t_z;
}