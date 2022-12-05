// const WebSocketServer = require('ws').WebSocketServer
// const step = 1

// const WSS_PORT = 8001

// const wss = new WebSocketServer({port: WSS_PORT})

// wss.on('connection', (ws) => {

//   console.log("Connection established.")

//   const websocketInterval = setInterval(() => {
//     const now = Date.now()
//     ws.send(`${now}`)
//   }, step)

//   ws.send('Server has been setup.')
// })

const WebSocket = require('ws')

let server = 'ws://localhost:8001/'


// params
const topic = 'test2'
const consumer = 'test-group'

const options = null    // Use null for now
const ws = new WebSocket(server + `?topic=${topic}&consumerGroup=${consumer}`, options)

ws.on('open', () => {
  console.log('Opened server for topic.')
})

ws.on('message', (data) => {
  console.log(`Data:`, data)
})