This is a gamified verison of Mihass Project a.k.a Ankylo

It uses Docker to provide portability, so you do not need to have MySQL or Python to start it up.  First you need to build a Python Server from the root folder:

$ docker build -t python-server -f Docker/BaseServerDockerfile .

To deploy and launch this project, run following commands.

$ cd Docker 
$ docker-compose build 
$ docker-compose up

Then go to http://localhost/ProjectOrganiser/ (if you use Docker for Windows/MacOS) or an IP stated when you start docker-toolbox.

To stop docker:

# cd Docker 
# docker-compose stop


Features Completed:
-Signin
-Signup


To Do:
-Navigation Bar***
-Submit Assignment
    -Selector***
    -Submission Window (1)***
-Submit Review
    -Select Mode*
    -Review Mode (3 + spike)***

-Read Feedback**
-Review Selector**
-Space Game*
-View Review**
-Profile
    -Skill Window
    -Statistics


-Teacher System side
    -Add New Standards**
    -Add/Modify Assignment**
    -Review Assignment*

