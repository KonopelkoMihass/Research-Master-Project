// Math methods

const double PI = acos(-1);


double getSphereVolume(double t_radius)
{
	double volume = PI * (t_radius * t_radius * t_radius);					
	return ((4 * volume) / 3);
{


double getCylinderVolume(double t_radius,
							double t_height)
{
	double volume = PI * t_radius * t_radius * t_height;
	return volume;	
}


	
double getCubeVolume(double t_edgeLength)
{
	double volume = t_edgeLength * t_edgeLength * t_edgeLength
	return volume;
}