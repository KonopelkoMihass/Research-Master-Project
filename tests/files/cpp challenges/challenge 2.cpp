#include "Trap.h"

const std::string c_SEED = "4W921s2sedpo[QWS2931";

bool Trap::trigger()
{
	// "generateOutcome" was declared earlier in this file
    bool trapResponce = generateOutcome(c_SEED);
    return trapResponce;
}