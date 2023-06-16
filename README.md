#!/bin/sh

a=1

osascript -e 'tell application "Terminal" to do script "cd Desktop/Nile_Tech_Projects/RSMS/ERetail_UI/angular-workspace;ng serve --open;"'

osascript -e 'tell application "Terminal" to do script "cd Desktop/Nile_Tech_Projects/RSMS/ERetail_API; mvn compile exec:java;mvn compile exec:java;mvn compile exec:java;mvn compile exec:java;mvn compile exec:java;mvn compile exec:java;mvn compile exec:java;mvn compile exec:java;mvn compile exec:java;mvn compile exec:java;mvn compile exec:java;mvn compile exec:java;mvn compile exec:java;mvn compile exec:java;mvn compile exec:java;mvn compile exec:java;mvn compile exec:java;mvn compile exec:java;mvn compile exec:java;mvn compile exec:java;"'

open  -a "Postgres"
sleep 10;

#osascript -e 'tell application "Terminal" to do script "cd /Applications/Postgres.app/Contents/Versions/15/bin/; psql -p5432 rsms_db"'



cd "Desktop/Nile_Tech_Projects/RSMS/ERetail_UI/angular-workspace/.angular"

sleep 60;

while [ $a -le 2 ]
do
echo “\n\nAngular cache manually removed : ”
rm -r cache;sleep 300;
done
