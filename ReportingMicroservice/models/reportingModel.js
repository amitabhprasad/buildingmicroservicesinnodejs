var DataAccess = require('./DataAccess.js');


var Model = function(){};
Model.prototype.GetReport = function (){
    return new Promise(function(fulfill,reject){
        DataAccess.GetEntities("reporting_microservice", "sales")
        .then(function(docs){
            fulfill(docs);
        }).catch(function (err){
            reject(err);
        })
    })
};

module.exports = new Model();