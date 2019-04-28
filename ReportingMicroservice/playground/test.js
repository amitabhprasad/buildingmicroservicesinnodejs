var fs = require('fs');

function fileSize (fileName) {
    return new Promise((resolve,reject)=>{
        fs.stat(fileName,function(err,data){
            if(err){
                reject(err);
            }
            resolve(data);
        })
    })

    /*
  Old way of passing Call back
    console.log('inside function');
    
    fs.stat(fileName, (err, stats) => {
      if (err) { return cb(err); } // Async
      cb(null, stats.size); // Async
    });
    console.log('exiting function');
      */
  }

  var proccessData = function(err,data){
      if(err){
          return console.log('error occured ',err);
      }
      console.log('Function executed ',data);
  }
  console.log('calling function');
  //fileSize('test.txt',proccessData);
  fileSize('test.txt')
  .then((data)=>{
    console.log(data.size);
  }).catch(function(err){
    console.log(err);
  });
  console.log('function called');

  // example of using Promise with async await
  //We can use the async/await feature with any function that supports a promise interface.
  console.log('calling asnc await function');
  async function checkFileSize(fileName){
      try{
        const data  = await fileSize(fileName);
        console.log(data.size);
      } catch(err){
          console.log(err);
      }
  }
  checkFileSize('test.txt');
  console.log('called asnc await function');