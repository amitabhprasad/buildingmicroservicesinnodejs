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
> db.sales.insertOne({"day":"WE","sales":148});

==============================
Event emitters:
    - 
Promises:
    - An object that represents the results of an asynchronous transactions
Callbacks:
    - In order to ensure that calls in nodejs are non-blocking, they need to be made asynchronous
    - Tradationally non-blocking calls were managed using callbacks for example
        function readJson(filename,callback){
            fs.readFile(filename,'utf-8',function(err,res){
                if(err) return callback(err);
                callback(null,JSON.parse(res));
            });
        }
    - in this callback function is passed as input argument to read function, this function is then called back once readFile
    function is complete.
    - For simple function this is fine, but in case we have to execute a series of workflow, which is nested async calls
    it becomes difficult to understand & to debug.

To manage above complexities there are cople of ways
1)  Event Emitters:
    
