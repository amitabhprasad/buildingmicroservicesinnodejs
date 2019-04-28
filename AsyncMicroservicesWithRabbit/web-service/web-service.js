const path =require('path');
require('dotenv').config({path:  path.resolve(process.cwd(), '../.env')});

const exppress = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const amqp = require('amqplib');

const app = exppress();

// Middleware
app.use(bodyParser.json());

// RabbitMQ connection string
const messageQueueConnectionString = process.env.CLOUDAMQP_URL;

// simulate request ids
let lastRequestId = 5;
//console.log('messageQueueConnectionString ',messageQueueConnectionString);

//handle request
app.post('/api/v1/processData',async function(req,res){
    // save request id and increment
  let requestId = lastRequestId;
  lastRequestId++;

  // connect to Rabbit MQ and create a channel
  let connection = await amqp.connect(messageQueueConnectionString);
  let channel = await connection.createConfirmChannel();

  // publish the data to Rabbit MQ
  let requestData = req.body.data;
  console.log("Published a request message, requestId:", requestId);

  publishToChannel(channel, { routingKey: "request", exchangeName: "processing", data: { requestId, requestData } });
  // send the request id in the response
  res.send({ requestId });

});

// utility function to publish messages to a channel
function publishToChannel(channel, { routingKey, exchangeName, data }) {
    setImmediate(()=>{
        return new Promise((resolve,reject)=>{
            channel.publish(exchangeName, routingKey, Buffer.from(JSON.stringify(data), 'utf-8'), 
                        { persistent: true }, function (err, ok) {
                if(err){
                    reject (err);
                }
                resolve();
            })
    
        })
    });
}


async function listenForResults(){
    console.log('listening for result message');
    // connect to Rabbit MQ
    let connection = await amqp.connect(messageQueueConnectionString);
    // create a channel and prefetch 1 message at a time
    let channel = await connection.createChannel();
    await channel.prefetch(1);

    // start consuming messages
    await consumeMessage({ connection, channel });
}

// consume messages from RabbitMQ
function consumeMessage({ connection, channel}) {
    return new Promise((resolve,reject)=>{
        channel.consume("processing.results", async function(msg){
            // parse message
            let msgBody = msg.content.toString();
            let data = JSON.parse(msgBody);
            let requestId = data.requestId;
            let processingResults = data.processingResults;

            console.log("Received a result message, requestId:", requestId, "processingResults:", processingResults);

            // acknowledge message as received
            await channel.ack(msg);
        });

        // handle connection closed
        connection.on("close", (err) => {
            return reject(err);
        });

        // handle errors
        connection.on("error", (err) => {
            return reject(err);
        });
        resolve();
    });
}

// Start the server
const PORT = 3000;
server = http.createServer(app);
server.listen(PORT, "localhost", function (err) {
  if (err) {
    console.error(err);
  } else {
    console.info("Listening on port %s.", PORT);
  }
});

// listen for results on RabbitMQ
listenForResults();