- MERN Stack
    Mongo, Express, React & Nodejs
- One repo for each Services
Install mongodb in Ubuntu:
- Add mongodb key
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 9DA31620334BD75D9DCB49F368818C72E52529D4
- Add installer details
echo "deb [ arch=amd64 ] https://repo.mongodb.org/apt/ubuntu bionic/mongodb-org/4.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-4.0.list
sudo apt-get update
sudo apt-get install mongodb-org
- create dirctory /data/db 
run mongodb
sudo service mongod start
 sudo tail -f /var/log/mongodb/mongod.log

 
Insert record to mongodb
use reporting_microservice;
switched to db reporting_microservice
> db.sales.insertOne({"day":"MO","sales":348});