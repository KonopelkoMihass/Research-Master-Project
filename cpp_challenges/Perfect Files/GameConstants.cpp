// File: GameConstants.cpp
// Line Length ruler.
//--|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|
//       10        20        30        40        50        60        70        80        90        100       110       120
//

/// <summary>
/// @author Anton Potemkin
/// @version 1.0
/// 
/// </summary>


#include "GameConstants.h"

/// For curling stone on ice...0.0168;
const double COEFF_KINETIC_FRICTION = 0.08f;		
/// Force of gravity...9.8 m/s
const double GRAVITY = 9.81f;					
/// Assume mass of 1Kg for the puck.
const double MASS_KG = 1;

		
/// Multiplier value for the puck force.
const double PUCK_FORCE_MULTIPLIER = 0.004f;

/// The minimal X axis for the field.
const double MIN_X = 1.51f;
/// The maximal X axis for the field.
const double MAX_X = 8.76f;
/// The further end of the field.
const double MIN_Z = -17.8f;
 
/// The launch position on Y axis. 
const double LAUNCH_Y = 2.4f;
/// The launch position on Z axis. 
const double LAUNCH_Z = 14.0f;
    
/// The Z position of the closest line.	
const double SCORING_LINE_1 = -1.85f;
/// The Z position of the middle line.	
const double SCORING_LINE_2 = -7.0f;
/// The Z position of the farthest line.	
const double SCORING_LINE_3 = -12.15f;
 
/// The line before scoring line 1, where pucks will be despawned. 
const double FOUL_LINE = 1.75f;

/// Update physics subsystem every 1/100 second
const double UPDATE_PHYSICS_GRANULARITY = 0.01f;
/// Update rendering subsystem every 1/30 second
const double UPDATE_RENDERING_GRANULARITY = 0.03f;

