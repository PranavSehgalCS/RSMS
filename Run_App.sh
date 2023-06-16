#!/bin/sh

a=1

osascript -e 'tell application "Terminal" to do script "cd Desktop/RSMS/ERetail_UI/angular-workspace;ng serve --open;"'

osascript -e 'tell application "Terminal" to do script "cd Desktop/RSMS/ERetail_API; mvn compile exec:java;mvn compile exec:java;"'

open  -a "Postgres"
sleep 10;

#osascript -e 'tell application "Terminal" to do script " /Applications/Postgres.app/Contents/Versions/15/bin/; psql -p5432 rsms_db"'
