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
