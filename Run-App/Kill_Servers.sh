#!/bin/sh
#///////////////////////////////////////////////////////////////////////////////////////////////////////
#   FILE : Kill_Servers.sh
#   AUTHOR : Pranav Sehgal
#   DESCRIPTION :   CLEARS Terminal history (Currently Disabled)
#                   CLEARS Angualar Cache
#                   CLOSES all Terminal windows with name containing Run_
#                   RUNS mvn clean; to clear target data; 
#                   CLOSES all Terminal windows with name containing Kill_Servers.sh
#///////////////////////////////////////////////////////////////////////////////////////////////////////

dir="${0%/*}";
parentdir="$(dirname "$dir")"

echo "Re-Adjusting Location : ";
sleep 1;
cd $parentdir;

osascript -e 'tell application "Terminal" to close (every window whose name contains "Run_")' &

rm -r ERetail_UI/angular-workspace/.angular/cache;
echo “\nAngular cache removed {Current Session} ”;

sleep 0.2;

cd ERetail_API/;
mvn clean;

sleep 0.2;

osascript -e 'tell application "Terminal" to close (every window whose name contains "Kill_App.sh")' &