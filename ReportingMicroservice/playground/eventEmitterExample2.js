const EventEmitter = require('events');
const fs = require('fs');

const util = require('util');
// Convert fs.readFile into Promise version of same    
const readFile = util.promisify(fs.readFile);

class WithTime extends EventEmitter {
    async execute(asyncFunc,...args){
        console.time('execute');
        this.emit('begin');
        const data = await asyncFunc(...args);
        this.emit('data',data);
        console.timeEnd('execute');
        this.emit('end');
        /*asyncFunc(...args,(err,data)=>{
            if(err){
                return this.emit('error', err);
            }
            this.emit('data', data);
            console.timeEnd('execute');
            this.emit('end');
        });*/
    }
}

const withtime = new WithTime();
withtime.on('begin', () => console.log('About to execute'));
withtime.on('end', () => console.log('Done with execute'));
withtime.on('data',(data)=>{
    console.log(data);
})

withtime.on('data',(data)=>{
    console.log(data.length);
})

withtime.execute(readFile,'test.txt');