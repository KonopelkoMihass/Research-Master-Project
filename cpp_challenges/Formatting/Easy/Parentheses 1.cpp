// Math methods
const double PI = 3.14159265359;

double getCylinderTotalArea(double t_radius,
							double t_height)
{
	double totalArea = 2 * PI * t_radius * t_height;
	return 2 * PI * t_radius * t_radius + totalArea;	
}

double getSphereSurfaceArea(double t_radius)
{
	double surfaceArea = ((4 * PI) * (t_radius * t_radius));					
	return surfaceArea;
{
	
double getCubeSurfaceArea(double t_edgeLength)
{
	return (6 * t_edgeLength * t_edgeLength);
}