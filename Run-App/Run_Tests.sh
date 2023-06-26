#!/bin/sh
#///////////////////////////////////////////////////////////////////////////////////////////////////////
#   FILE : Run_Tests.sh
#   AUTHOR : Pranav Sehgal <PranavSehgalCS>
#   DESCRIPTION :   OPENS a Terminal window and starts tests via mvn test;
#///////////////////////////////////////////////////////////////////////////////////////////////////////

dir="${0%/*}";
parentdir="$(dirname "$dir")"

cd $parentdir
echo "\n\nCurrent Durectory :";
echo $parentdir;

cd ERetail_API/
echo "/Project_API/"

#mvn package;
echo "\n\nNo tests Created Yet!\n\n"; 
sleep 1;

#open $parentdir/ERetail_API/target/site/jacoco/index.html
#open $parentdir/ERetail_API/target/surefire-reports
sleep 10

osascript -e 'tell application "Terminal" to close (every window whose name contains "Run_T.sh")' &