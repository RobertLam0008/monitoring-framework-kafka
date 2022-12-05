const { Kafka } = require('kafkajs')
const KafkaProxy = require('kafka-proxy');
const WebSocketServer = require('ws').WebSocketServer

const WSS_PORT = 8001

// Consume
let kafkaProxy = new KafkaProxy({
  wsPort: WSS_PORT, 
  kafka: 'localhost:9092/',
});

kafkaProxy.listen()

// Produce
const TARGET_PORT = 8002
const targ_wss = new WebSocketServer({port: TARGET_PORT})
const kafka = new Kafka({
    clientId: 'app',
    brokers: ['localhost:9092']
  })
const producer = kafka.producer()

targ_wss.on('connection', (ws) => {

  console.log("Connection established.")

  ws.on('message', async (data) => {
    console.log("Received msg")
    const text = data.toString()
    await producer.connect()
    await producer.send({
      topic: 'test1',
      messages: [
        { key: 'key1', value: text, partition: 0}
      ]
    })
  })

  ws.send('Server has been setup.')
})