var boolResult = this.testIfLoaded();

if (boolResult == true)
{
	return this.notLoaded();
}
else
{
	return this.loaded();
}