#!/bin/sh
SCRIPT="echo 'Entered the system.'; 
				if [ ! -d 'mk-gs-challenges' ] 
				then
					echo 'MAKE DIRECTORY'
					sudo mkdir -p 'mk-gs-challenges'
				else
					echo 'Directory exists'
				fi
				
				sudo cp -r --no-preserve=mode,ownership mk-gs/py/challenges/ mk-gs-challenges;  
				echo 'Successfully duplicated challenges';"

ssh -l user1 149.153.5.22 "${SCRIPT}"

echo "Please select a folder to put it in within C:/Study_Challenges/"
read directrotia

if [ ! -d "C:/Study_Challenges/" ] 
then
	mkdir -p "C:/Study_Challenges/"
fi

echo "Please enter password for the server again"
scp -r user1@149.153.5.22:/home/user1/mk-gs-challenges c:/Study_Challenges/$directrotia

$SHELL