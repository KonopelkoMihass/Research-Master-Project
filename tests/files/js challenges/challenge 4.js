calculateAttack()
{
    return app.random()+this.user.lvl-this.enemy.defence;
}