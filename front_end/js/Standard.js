class Standard
{
    constructor(data)
    {
        this.number = data.id;
        this.category = data.category;
        this.subCategory = data.sub_category;
        this.description = data.description;
        this.name = data.name;

        this.rewardScore = data.reward_score;
        this.penaltyScore = data.penalty_score;
        this.enabled = data.enabled;
        this.unlockedAtLevel = data.unlocked_at_level;

    }
}
