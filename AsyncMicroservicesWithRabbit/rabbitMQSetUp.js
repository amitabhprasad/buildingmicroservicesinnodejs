const dotenv = require('dotenv');
const amqp = require('amqplib');

dotenv.config();
// RabbitMQ connection string
const messageQueueConnectionString = process.env.CLOUDAMQP_URL;

//console.log("messageQueueConnectionString ",messageQueueConnectionString);

async function setup(){
    console.log('Setting up Rabbit MQ Exchanges/Queues');

    //Create Rabbit MQ instance
    let connect = await amqp.connect(messageQueueConnectionString);

    //create channel
    let channel = await connect.createChannel();

    //create exchange
    await channel.assertExchange("processing", "direct", { durable: true });

    //create queues
    await channel.assertQueue("processing.requests", { durable: true });
    await channel.assertQueue("processing.results", { durable: true });

    // bind queues
    // here "processing" -->Exchange
    // "processing.requests" -->Queues
    // "request/result" --> routing key to be used for publishing message in the queue
    await channel.bindQueue("processing.requests","processing", "request");
    await channel.bindQueue("processing.results","processing", "result");

    console.log("Setup DONE");
    process.exit();
}

setup();