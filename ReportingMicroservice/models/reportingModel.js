var DataAccess = require('./DataAccess.js');


var Model = function(){};
Model.prototype.GetReport = function (){
    return new Promise(function(resolve,reject){
        DataAccess.GetEntities("reporting_microservice", "sales")
        .then((docs)=>{
            resolve(docs);
        }).catch(function (err){
            reject(err);
        })
    })
};

module.exports = new Model();