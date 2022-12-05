'use strict';
const kafkaSse = require('kafka-sse');
const server = require('http').createServer((req, res) => {
  res.writeHead(200, {
    'Access-Control-Allow-Origin': '*'
  })
});

const customDeserializer = (msg) => {
  msg.message = msg.value
  //console.log(msg)

  return msg
}

const options = {
  deserializer: customDeserializer,
  kafkaConfig: {'metadata.broker.list': 'localhost:9092'}
}

server.on('request', (req, res) => {
    const topics = req.url.replace('/', '').split(',');
    console.log(`Handling SSE request for topics ${topics}`);
    kafkaSse(req, res, topics, options)
    // This won't happen unless client disconnects or kafkaSse encounters an error.
    .then(() => {
        console.log('Finished handling SSE request.');
    });
});

server.listen(8001);
console.log('Listening for SSE connections at http:/localhost:8001/test2');