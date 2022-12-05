import { useState, useRef, useEffect } from 'react'
import { subscribe } from '../../clients/ws_kafka'

const BenchTest = ({ }) => {
  const https = require('https')

  const [http1, setHttp1] = useState('')
  const [http2, setHttp2] = useState('')
  const [ws, setWS] = useState('')

  // Data retrieval settings.
  const numClients = 1
  const numEntries = 1000
  let clientsRemaining = numClients

  // Data cache.
  let cacheData = []
  let clientList = []

  // Statistic logging functions.
  // Retrieve statistics.
  const getStandardDeviation = (data) => {
    if (data.length === 0) return

    const mean = data.reduce((a, b) => (a + b)) / data.length

    // Get squared difference.
    const variance = data.map((d) => (d - mean) ** 2)
      .reduce((total, elem) => total + elem) / data.length

    // Get square root of variance for standard deviation.
    const output = Math.sqrt(variance)

    return output;
  }

  const logCacheStats = (c, type, finalTime) => {
    if (c.length < 1) return
    const sumLatency = c.reduce((a, b) => (a + b))
    const numData = c.length
    const averageLatency = sumLatency / numData
    const standardDeviation = getStandardDeviation(c)
    const dataMin = Math.max(0, Math.min(...c))
    const dataMax = Math.max(...c)

    const out = `
               sum latency: ${sumLatency}
               data entries: ${numData}
               average latency: ${averageLatency}
               standard deviation: ${standardDeviation}
               min latency: ${dataMin}
               max latency: ${dataMax}
               final time: ${finalTime}`

    console.log(out)
    type === '1' ? setHttp1(out)
      : type === '2' ? setHttp2(out)
        : setWS(out)

  }

  const streamWS = () => {
    const startTime = Date.now()
    for (let c = 0; c < numClients; c += 1) {
      cacheData.push([])

      const ws = new WebSocket('ws://localhost:8001')
      let startTime

      ws.onopen = () => {
        console.log("Websocket open.")
        startTime = Date.now()
      }

      ws.onmessage = (msg) => {

        //console.log("Message:", msg)

        const now = Date.now()
        const then = parseFloat(msg.data)
        const latency = isNaN(then) ? -1 : now - then   // -1 means the msg we received wasn't a timestamp

        if (latency > -1) {
          //console.log("Latency:", latency)
          // Push data to cache.
          cacheData[c].push(latency)
          // console.log(latency)

          if (cacheData[c].length == numEntries) {
            clientsRemaining -= 1
            //console.log("Closing Websocket at ", numEntries, " entries.")
            //logCacheStats(cacheData[c])

            if (clientsRemaining == 0) {
              const finalTime = Date.now() - startTime
              console.log(`Final Time: ${finalTime}`)
              console.log("TOTAL RESULTS (WS):")
              logCacheStats(cacheData.flat(), '3', finalTime)

            }

            ws.close()
          }
        }

      }

    }
  }

  const streamHttp2 = () => {
    const startTime = Date.now()
    for (let c = 0; c < numClients; c += 1) {
      cacheData.push([])
      const client = new EventSource('https://localhost:8080')
      console.log("Open event source")

      clientList.push(client)
      client.onmessage = (event) => {
        // To ensure same packet with same timestamp:
        // Pick a static block with the timestamp (1byte, 1kb, 1mb)

        //console.log(`Client ${c} is receiving data.`)
        // On receiving data, measure the immediate latency.
        const timestamp = parseFloat(event.data)
        const now = Date.now()
        const latency = Math.max(0, now - timestamp)

        // console.log(timestamp)
        //console.log(`now: ${now}, timestamp: ${timestamp}, latency: ${latency}`)

        // //if (latency > 100) console.log(`over100: ${latency} from client ${c}`)

        cacheData[c].push(latency)

        if (cacheData[c].length == numEntries) {
          clientsRemaining -= 1
          // On end, log all the stats.
          // Immediately close if we have no data.
          if (cacheData[c].length < 1) {
            console.log("No data!")
            client.close()
            return
          }

          //console.log(`\n               Client: ${c}`)
          //logCacheStats(cacheData[c])

          client.close()

          if (clientsRemaining == 0) {
            const finalTime = Date.now() - startTime
            console.log(`Final Time: ${finalTime}`)
            console.log("TOTAL RESULTS HTTP/2:")
            logCacheStats(cacheData.flat(), '2', finalTime)
            client.close()

          }
        }
      }
    }
  }

  const streamHttp1 = () => {
    const startTime = Date.now()
    for (let c = 0; c < numClients; c += 1) {
      cacheData.push([])
      let poll
      let ignoreFirst = false

      const clientSubscribe = async () => {
        const agent = new https.Agent({
          rejectUnauthorized: false
        })
        const now = Date.now()
        const response = await fetch('https://localhost:8000/data', { agent })
        const msg = await response.text()
        if (msg) {
          if (!ignoreFirst) {
            ignoreFirst = true
            return
          }
          const data = JSON.parse(msg)
          const f = data[0]
          const latency = Math.abs(now - f)


          // Push data to cache.
          cacheData[c].push(latency)

          // Check if we reached the desired number of entries.
          if (cacheData[c].length == numEntries) {
            const finalTime = Date.now() - startTime
            console.log(`Final Time: ${finalTime}`)
            clearInterval(poll)
            logCacheStats(cacheData[c], '1', finalTime)

            return
          }

          // Call subscribe again to pull data, skip if batch is empty.
          // Frequency of pulling data will change.
          clientSubscribe()
        }

      }

      console.log("Started pulling data...")
      const pollFreq = 1    // Same time as step, mostly to sync
      poll = setInterval(() => {
        clientSubscribe()
      }, pollFreq)
    }
  }



  return (
    <div>
      <h1>React - Benchmark Testing</h1>
      <div style={{ display: 'flex', justifyContent: 'space-evenly', padding: '0px 200px' }}>
        <div>
          <h2>HTTP/1.1</h2>
          <button onClick={() => streamHttp1()}>Stream HTTP/1.1</button>
          <div>{http1.split('\n').map((d) => (<>{d}<br /></>))}</div>
        </div>
        <div>
          <h2>WS</h2>
          <button onClick={() => streamWS()}>Stream WS</button>
          <div>{ws.split('\n').map((d) => (<>{d}<br /></>))}</div>
        </div>
        <div>
          <h2>HTTP/2</h2>
          <button onClick={() => streamHttp2()}>Stream HTTP/2</button>
          <div>{http2.split('\n').map((d) => (<>{d}<br /></>))}</div>
        </div>
      </div>
    </div>
  )
}

export default BenchTest
