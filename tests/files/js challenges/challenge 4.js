calculateAttack()
{
    return app.utils.random(this.minDamage,this.maxDamage,this.user.level,this.user.strength);
}