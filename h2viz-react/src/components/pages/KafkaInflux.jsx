import { useState, useRef, useEffect } from 'react'
//import { subscribe } from '../../clients/ws_kafka'
import { subscribe } from '../../clients/eventSource_kafka'
import KafkaInfluxRecord from '../ui/KafkaInfluxRecord'

const KafkaInflux = ({ }) => {

  const [messages, setMessages] = useState({})
  const [latencies, setLatencies] = useState({})
  const [influxMessages, setInfluxMessages] = useState([])
  const [influxMessages_2, setInfluxMessages_2] = useState([])
  const [allInflux, setAllInflux] = useState({})
  const [allNextInflux, setAllNextInflux] = useState({})
  const [nextInflux, setNextInflux] = useState([])
  const [nextInflux_2, setNextInflux_2] = useState([])
  const [flag, setFlag] = useState(false)
  const [allLatest, setAllLatest] = useState({})
  const [latest_1, setLatest_1] = useState(0)
  const [latest_2, setLatest_2] = useState(0)
  const [startTime, setStartTime] = useState(0)
  const [now, setNow] = useState(0)
  const ws = useRef(null)
  const stream = useRef(null)
  const inputRef = useRef(null)
  const start = Date.now()

  const DATA_ENTRIES = [20, 100, 500, 1000, 2000]
  const pollFreq = 100
  const NUM_CONNECTIONS = 8
  const formap = [0, 1, 2, 3, 4, 5, 6, 7]

  const logInfo = (data, tag) => {
    console.log(start, Date.now())
    console.log(`${tag} Messages (${data.length}): 
          Average Latency: ${getMean(data)}
          Median Latency:  ${getMedian(data)}
          STD: ${getStandardDeviation(data)}
          COV: ${(getStandardDeviation(data) / getMean(data))}
          Min: ${Math.max(0, Math.min(...data))}
          Max: ${Math.max(...data)}
          Time Taken: ${Date.now() - start}
        `)
  }

  const getMean = (vals) => {
    return +(vals.reduce((a, b) => a + b) / vals.length).toFixed(4)
  }

  const getMedian = (vals) => {
    let newVals = Array.from(vals)
    if (newVals.length < 1) {
      return 0
    }

    newVals.sort((a, b) => a - b)
    let half = Math.floor(newVals.length / 2)
    if (newVals.length % 2)
      return newVals[half]

    return (newVals[half - 1] + newVals[half]) / 2.0;
  }

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

  useEffect(() => {
    // Setup num connections for Kafka.
    let messagesObj = {}
    let latencyObj = {}
    for (let i = 0; i < NUM_CONNECTIONS; i++) {
      messagesObj[`test${2 + i}`] = []
      latencyObj[`test${2 + i}`] = []
    }

    console.log(messagesObj)

    setMessages(messagesObj)
    setLatencies(latencyObj)

    console.log("SETUP INIT")

    // Influx


    // stream.current = subscribe(handleOnMessage)
  }, [])

  useEffect(() => {
    if (allNextInflux[`0`] === undefined) return
    // Update influx messages.
    // console.log("On message received.")
    let latestObj = {}
    let messagesObj = {}

    for (let i = 0; i < NUM_CONNECTIONS; i++) {
      const influxMsg = allNextInflux[`${i}`].filter(d => d.time > allLatest[i])
      const next = allInflux[`${i}`] ? [...allInflux[`${i}`], influxMsg].flat() : [influxMsg].flat()
      const latest = Math.max(...influxMsg.map(d => d.time))
      latestObj[`${i}`] = latest
      messagesObj[`${i}`] = next

      // console.log("ALLINFLUX:",allInflux)

      for (let j = 0; j < DATA_ENTRIES.length; j++) {
        const stopmark = DATA_ENTRIES[j]
        if (next.length >= stopmark - 50 && next.length <= stopmark + 50 && next.length >= 90) {
          logInfo(next.map(d => d.latency), `INFLUX_${i + 1}`)
        }
      }
    }

    setAllLatest(latestObj)
    setAllInflux(messagesObj)


  }, [allNextInflux])

  /*
  useEffect(() => {
    // Update influx messages.
    // console.log("On message received_2.")

    const influxMsg_2 = nextInflux_2.filter(d => d.time > latest_2)
    const next = [...influxMessages_2, influxMsg_2].flat()
    setLatest_2(Math.max(...influxMsg_2.map(d => d.time)))
    setInfluxMessages_2(next)

    for (let i = 0; i < NUM_CONNECTIONS; i++) {
      for (let j = 0; j < DATA_ENTRIES.length; j++) {
        const stopmark = DATA_ENTRIES[j]
        if (next.length >= stopmark - 50 && next.length <= stopmark + 50 && next.length >= 10) {
          logInfo(next.map(d => d.latency), `INFLUX_${i + 1}`)
        }
      }
    }

  }, [nextInflux_2])
  */

  const fetchFromInflux = async (link) => {
    let res = {}
    await fetch(`http://localhost:3001/${link}`)
      .then(res => res.json())
      .then(data => res = { data })

    // Parse the data.
    const data = res.data.split('|').filter(d => d !== "").map(d => JSON.parse(d))
    data.map(d => d.latency = Date.now() - d.ts)
    // console.log(data)
    return data
  }

  const parseMessage = (message) => {
    return message.split(',')[0]
  }

  const parseTimestamp = (message) => {
    // console.log("NOW:", Date.now(), "THEN:", parseFloat(message.split(',')[1]), "LATENCY:", Date.now() - parseFloat(message.split(',')[1]))
    // console.log("CURRENT:", startTime)
    return Date.now() - Math.max(startTime, parseFloat(message.split(',')[1]))
  }

  const benchmarkInflux = async () => {

    // 1st
    let data = {}
    for (let i = 0; i < NUM_CONNECTIONS; i++) {
      const influxData = await fetchFromInflux(`api-${i}`)
      data[`${i}`] = influxData
    }

    setAllNextInflux(data)

    // 2nd
    // const influxData_2 = await fetchFromInflux('api-1')
    // setNextInflux_2(influxData_2)
  }

  const handleOnMessage = async (event, topic) => {
    const data = { 'message': event }
    const msg = Array.isArray(data) ? data.map((d) => parseMessage(d.message)) : parseMessage(data.message)
    const ts = Array.isArray(data) ? data.map((d) => parseTimestamp(d.message)) : parseTimestamp(data.message)

    // Update array that contains all messages.
    let prev = messages
    prev[topic].push(msg)
    prev[topic] = prev[topic].flat()

    let prev_lat = latencies
    prev_lat[topic].push(ts)
    prev_lat[topic] = prev_lat[topic].flat()

    setMessages(prev)
    setLatencies(prev_lat)

    for (let i = 0; i < NUM_CONNECTIONS; i++) {

      for (let j = 0; j < DATA_ENTRIES.length; j++) {
        const stopmark = DATA_ENTRIES[j]
        if (prev[`test${2 + i}`].length >= stopmark - 10 && prev[`test${2 + i}`].length <= stopmark + 10) {
          logInfo(prev_lat[`test${2 + i}`], `KAFKA_${i + 1}`)
        }
      }
    }

    // if (prev['test2'].length >= DATA_ENTRIES) {
    //   logInfo(prev_lat['test2'], 'KAFKA_1')
    // }

    // if (prev['test3'].length >= DATA_ENTRIES) {
    //   logInfo(prev_lat['test3'], 'KAFKA_2')
    // }

    // Fetch data from influx as well.

    // 1st
    // const influxData = await fetchFromInflux('api-0')
    // setNextInflux(influxData)

    // // 2nd
    // const influxData_2 = await fetchFromInflux('api-1')
    // setNextInflux_2(influxData_2)

    // console.log("doing something")

    let _data = {}
    for (let i = 0; i < NUM_CONNECTIONS; i++) {
      const influxData = await fetchFromInflux(`api-${i}`)
      _data[`${i}`] = influxData
    }

    setAllNextInflux(_data)


    setFlag(!flag)
  }

  const handleProduceMessage = (val) => {
    // Write to WS.
    // console.log("Writing message", val)
    // ws.current.send(val)
  }

  return (
    <div>
      <h1>Kafka against InfluxDB</h1>
      <button onClick={() => {
        // setInterval(benchmarkInflux, pollFreq)
        stream.current = subscribe(handleOnMessage)
      }}>Start stream</button>
      <div style={{ padding: '40px 100px' }}>

        {allInflux['0'] !== undefined && 
          <>
            <KafkaInfluxRecord title='Kafka Topic: CO(GT)' messages={messages['test2']} latencies={latencies['test2']} />
            <KafkaInfluxRecord title='Kafka Topic: PT08.S1(CO)' messages={messages['test3']} latencies={latencies['test3']} />
            <KafkaInfluxRecord title='InfluxDB Polling: CO(GT)' messages={allInflux[`0`].map(d => `CO(GT): ${d.value}`)} latencies={allInflux[`0`].map(d => d.latency)} />
            <KafkaInfluxRecord title='InfluxDB Polling: PT08.S1(CO)' messages={allInflux[`1`].map(d => `PT08.S1(C0): ${d.value}`)} latencies={allInflux[`1`].map(d => d.latency)} />
          </>
        }

        { /*
          allInflux['0'] !== undefined && formap.map(d => (
            <KafkaInfluxRecord title='InfluxDB Polling' messages={allInflux[`${d}`].map(e => e.value)} latencies={allInflux[`${d}`].map(e => e.latency)} />
          ))
          */
        }

      </div>
    </div >
  )
}

export default KafkaInflux
