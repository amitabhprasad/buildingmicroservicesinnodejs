const path =require('path');
require('dotenv').config({path:  path.resolve(process.cwd(), '../.env')});

const amqp = require('amqplib');

// RabbitMQ connection string
const messageQueueConnectionString = process.env.CLOUDAMQP_URL;

console.log('messageQueueConnectionString ',messageQueueConnectionString);

async function listenForMessages(){
    console.log('listening for requests message');
    // connect to Rabbit MQ
    let connection = await amqp.connect(messageQueueConnectionString);
    // create a channel and prefetch 1 message at a time
    let channel = await connection.createChannel();
    await channel.prefetch(1);

    let resultsChannel = await connection.createConfirmChannel();
    
    // start consuming messages
    await consumeMessage({ connection,channel, resultsChannel });
}

// consume messages from RabbitMQ
function consumeMessage({ connection, channel, resultsChannel }) {
    return new Promise((resolve,reject)=>{
        channel.consume("processing.requests", async function(msg){
            // parse message
            let msgBody = msg.content.toString();
            let data = JSON.parse(msgBody);
            let requestId = data.requestId;
            let requestData = data.requestData;

            console.log("Received a request message, requestId:", requestId);

            // process data
            let processingResults = await processMessage(requestData);
            // publish results to channel
            await publishToChannel(resultsChannel, {
                                exchangeName: "processing",
                                routingKey: "result",
                                data: { requestId, processingResults }
                            });
            console.log("Published results for requestId:", requestId);

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

// simulate data processing that takes 5 seconds
function processMessage(requestData) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(requestData + "-processed")
      }, 5000);
    });
  }

// utility function to publish messages to a channel
function publishToChannel(channel, { routingKey, exchangeName, data }) {
    return new Promise((resolve, reject) => {
      channel.publish(exchangeName, routingKey, Buffer.from(JSON.stringify(data), 'utf-8'), { persistent: true }, function (err, ok) {
        if (err) {
          return reject(err);
        }
        resolve();
      })
    });
  }
listenForMessages();
