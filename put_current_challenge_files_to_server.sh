#!/bin/sh

echo "Please select a folder to get challenges from within C:/Study_Challenges/"
read directrotia

echo "Please enter password for the server"
scp -r c:/Study_Challenges/$directrotia user1@149.153.5.22:/home/user1/mk-gs-challenges 




SCRIPT="echo 'Entered the system.'; 
				sudo cp -r mk-gs-challenges/$directrotia/* mk-gs/py/;
				echo 'Successfully replaced challenges';"

ssh -l user1 149.153.5.22 "${SCRIPT}"

echo "Successfully put challenges"


$SHELL