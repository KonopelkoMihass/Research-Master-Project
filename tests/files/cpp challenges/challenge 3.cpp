int calculateAILevel(locationLvl, difficulty)
{
    if(locationLvl==Difficulty.High&&difficulty==Difficulty.High){
        // Aware of skills and resources player possesses.  Double stamina and not stun-able
        return AILevel.HighStrategicAndCheat;
    }
}