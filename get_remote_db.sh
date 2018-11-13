#!/bin/sh
SCRIPT="echo 'Entered the system.'; 
				if [ ! -d 'mk-gs-DB' ] 
				then
					echo 'MAKE DIRECTORY'
					sudo mkdir -p 'mk-gs-DB'
				else
					echo 'Directory exists'
				fi

				sudo cp -r --no-preserve=mode,ownership mk-gs/Docker/MySQL/ mk-gs-DB; 
				sudo cp -r --no-preserve=mode,ownership mk-gs/py/logs/ mk-gs-DB;  
				echo 'Successfully duplicated Data'"

ssh -l user1 149.153.5.22 "${SCRIPT}"

echo "Please select a folder to put it in within C:/Study_Database/"
read directrotia

if [ ! -d "C:/Study_Database/" ] 
then
	mkdir -p "C:/Study_Database/"
fi


echo "Please enter password for the server again"
scp -r user1@149.153.5.22:/home/user1/mk-gs-DB c:/Study_Database/$directrotia

$SHELL