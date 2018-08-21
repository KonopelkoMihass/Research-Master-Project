This is a gamified verison of Mihass Project 

There is how versioning is done for this project:
-The Build system - each commit is assigned a build number.  Each commit is buildable and should compile and be deployed.
-The Release system - this system encloses a list of builds to make a signifcant release.  Release versioning follows this structure: vX.Y.Z
--X is a major release.  Difference between iterations of X is big enough to threat a newer X as a proper sequel to earlier X
--Y is a feature release.  As a new feature is added, it incrememnts.  The feature should be of a release quality to increment Y.
--Z is a test release.  It increments after each user test.