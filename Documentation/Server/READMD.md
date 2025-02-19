# Guide to set up server

docker network create cloud77_dev

mirror `docker.m.daocloud.io`

Backup Database
mongodump --authenticationDatabase=admin --username root --password 123456 --db tester -o /home/data

Backup Collection
mongoexport --authenticationDatabase=admin --username root --password 123456 --db tester --collection Users --out /home/data/users.json

Restore Database
mongorestore --authenticationDatabase=admin --username root --db tester --drop /home/data
