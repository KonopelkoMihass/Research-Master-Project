const std::string Seed = "4W921s2sedpo[QWS2931";

bool Trap::trigger()
{
    bool trapResponce = generateOutcome(Seed);
    return trapResponce;
}