#!/bin/sh
#///////////////////////////////////////////////////////////////////////////////////////////////////////
#   FILE : Run_Maven.sh
#   AUTHOR : Pranav Sehgal
#   DESCRIPTION :   OPENS a Terminal window and launches backend using mvn compile exec:java;
#///////////////////////////////////////////////////////////////////////////////////////////////////////

dir="${0%/*}";
parentdir="$(dirname "$dir")";

echo "\n\n\n";
cd $parentdir;
cd ../ERetail_API;

mvn clean;

printf '\033[8;20;99t'
mvn compile exec:java;
mvn compile exec:java;
mvn compile exec:java;
mvn compile exec:java;
mvn compile exec:java;
mvn compile exec:java;
mvn compile exec:java;
mvn compile exec:java;
mvn compile exec:java;
mvn compile exec:java;