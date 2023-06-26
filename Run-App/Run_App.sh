#!/bin/sh
#///////////////////////////////////////////////////////////////////////////////////////////////////////
#   FILE : Run_Servers.sh
#   AUTHOR : Pranav Sehgal
#   DESCRIPTION :   OPENS a Terminal window and launches backend using mvn compile exec:java;
#                   CLEARS Angular Cache from previous session
#                   OPENS a Terminal window and launches fronted using ng serve --open;
#///////////////////////////////////////////////////////////////////////////////////////////////////////

dir="${0%/*}";
parentdir="$(dirname "$dir")"

sleep 1;
cd $parentdir;

open Run-App/Seprate_Scripts/run_maven.sh
open Run-App/Seprate_Scripts/run_angular.sh


rm -r /ERetail_UI/angular-workspace/.angular/cache;

sleep 2;

osascript -e 'tell application "Terminal" to close (every window whose name contains "Run_App.sh")' &