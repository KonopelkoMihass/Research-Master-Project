#include "Trap.h"

const std::string SEED = "4W921s2sedpo[QWS2931";

bool trap::trigger()
{
	// "generateOutcome" was declared earlier in this file
    bool trapResponce = generateOutcome(SEED);
    return trapResponce;
}