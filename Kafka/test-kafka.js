const { Kafka } = require('kafkajs')
const KafkaProxy = require('kafka-proxy');
const WSS_PORT = 8001

// const kafka = new Kafka({
//   clientId: 'app',
//   brokers: ['localhost:9092']
// })

// // Try consume a message.
// const consumer = kafka.consumer({
//   groupId: 'test-group'
// })

// const producer = kafka.producer()

// const messageHandler = async ({ message }) => {
//   const msg = message.value.toString()
//   console.log("MESSAGE:", msg)

//   // Do some processing (word count).
//   const count = msg.split(' ').length

//   await producer.send({
//     topic: 'test1',
//     messages: [
//       { value: `Received ${count} words.` }
//     ]
//   })

//   // Try send to websocket.
//   //ws.send(msg)

// }

// const main = async () => {
//   await producer.connect()
//   await consumer.connect()
//   await consumer.subscribe({
//     topic: 'test2',
//   })


//   await consumer.run({
//     eachMessage: messageHandler,
//   })

// }

/*
const start = async (ws) => {
  await consumer.run({
    eachMessage: ({message}) => messageHandler(ws, message),
  })
}
*/

/*
wss.on('connection', (ws) => {
  // Send info here.
  start(ws)

  ws.send('Server has been setup.')
})
*/

// Main.
//main()



// WS stuff



// const wss = new WebSocketServer({ port: WSS_PORT })

// wss.on('connection', (ws) => {

//   console.log("Connection established.")

//   await producer.connect()
//   await consumer.connect()
//   await consumer.subscribe({
//     topic: 'test2',
//   })

//   await consumer.run({
//     eachMessage: messageHandler,
//   })

//   ws.send('Server has been setup.')
// })


let kafkaProxy = new KafkaProxy({
  wsPort: WSS_PORT, 
  kafka: 'localhost:9092/',
});

kafkaProxy.listen()