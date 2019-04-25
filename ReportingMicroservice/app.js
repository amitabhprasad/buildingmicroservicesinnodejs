var express = require('express');
var config = require('config');

var microserviceConfig = config.get('microservice.config');

//instantiate reporting model
var model = require('./models/reportingModel')

var app = express()
//Get Json reporting data by report name

app.get('/getreport',function(req,res){
    console.log("Inside get report");
    res.send(model.GetReport(req,res));
});

app.get('/getcsv',function(req,res){
    console.log("Inside get CSVreport");
    res.send(model.GetReport(req,res));
})

//var server = app.listen(microserviceConfig.port, microserviceConfig.host,function(){
var server = app.listen(80, microserviceConfig.host,function(){
    var host = server.address().address;
    var port = server.address().port;
    console.log('Server Running On: http://%s:%s', host, port);
});