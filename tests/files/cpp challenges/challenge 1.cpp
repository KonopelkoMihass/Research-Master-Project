// Seems something is off with naming... not sure.

#include "Trap.h"
const std::string SEED = "4W921s2sedpo[QWS2931";
bool trap::trigger()
{
	// "generateOutcome" was declared earlier in this file
	int damage_delivered = 0;
    bool trapResponce = this.generateOutcome(SEED);
	
	// some internal logic.
	
    return damage_delivered;
}