// Some includes.

class Projectile
{
	
	// Some inside class logic.

private:
	
	/// Movement speed.
	double m_SpeedMeters {0};

	/// A sprite for the projectile.
	sf::Sprite projectile;

	/// The bounding rectangle for this projectile.
	sf::IntRect m_projectileRect { 5, 178, 10, 6 };
};