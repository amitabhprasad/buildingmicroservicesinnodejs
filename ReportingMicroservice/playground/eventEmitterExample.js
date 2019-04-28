const EventEmitter = require('events');

class WithLog extends EventEmitter {
    execute(taskFunc){
        console.log('Before executing');
        this.emit('begin');
        taskFunc();
        this.emit('end');
        console.log('After executing');
    }
}

const withLog = new WithLog();
withLog.on('begin', () => console.log('About to execute'));
withLog.on('end', () => console.log('Done with execute'));

//sync call
withLog.execute(() => console.log('*** Executing task ***'));
console.log("******************* ASYNC CALL ************************")
//async call
//taskFunc passed is async simulation
withLog.execute(() => {
    setImmediate(()=>{
        console.log('*** Executing task ***')
    });
});