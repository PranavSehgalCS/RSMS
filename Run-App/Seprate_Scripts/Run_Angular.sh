#!/bin/sh
#///////////////////////////////////////////////////////////////////////////////////////////////////////
#   FILE : Run_Angular.sh
#   AUTHOR : Pranav Sehgal
#   DESCRIPTION :   OPENS a Terminal window and launches Frontenf using mvn compile exec:java;
#///////////////////////////////////////////////////////////////////////////////////////////////////////

dir="${0%/*}";
parentdir="$(dirname "$dir")";

echo "\n\n\n";
cd $parentdir;
cd ../ERetail_UI/angular-workspace;

echo "Staring Angular : \n\n";

sleep 1;


printf '\033[8;5;40t';
ng serve --open;