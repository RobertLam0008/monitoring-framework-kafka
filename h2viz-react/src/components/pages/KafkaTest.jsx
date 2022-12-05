import { useState, useRef, useEffect } from 'react'
import { subscribe } from '../../clients/ws_kafka'

const KafkaTest = ({ }) => {

  const [messages, setMessages] = useState({ test2: [], test1: [] })
  const [latencies, setLatencies] = useState({ test2: [] })
  const [flag, setFlag] = useState(false)
  const ws = useRef(null)
  const stream = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    // WS to produce messages to kafka.
    const targetServer = 'ws://localhost:8002/'
    console.log("Open")
    ws.current = new WebSocket(targetServer)
  }, [])

  const parseMessage = (message) => {
    return message.split(',')[0]
  }

  const parseTimestamp = (message) => {
    return Date.now() - parseFloat(message.split(',')[1])
  }

  const handleOnMessage = (event, topic) => {
    const data = JSON.parse(event.data)
    const msg = Array.isArray(data) ? data.map((d) => parseMessage(d.message)) : parseMessage(data.message)
    const ts = Array.isArray(data) ? data.map((d) => parseTimestamp(d.message)) : parseTimestamp(data.message)

    // Update array that contains all messages.
    let prev = messages
    prev[topic].push(msg)
    prev[topic] = prev[topic].flat()

    let prev_lat = latencies
    prev_lat[topic].push(ts)
    prev_lat[topic] = prev_lat[topic].flat()

    // console.log('msg:', msg)
    setMessages(prev)
    setLatencies(prev_lat)

    // Test sending processed data to topic test1
    // if (topic === 'test2') {
    //   const wordCounts = msg
    //     .map((d) => d.split(' ').length)
    //     .map((d) => handleProduceMessage(`test2 received ${d} words`))
    // }

    setFlag(!flag)
  }

  const handleProduceMessage = (val) => {
    // Write to WS.
    console.log("Writing message", val)
    ws.current.send(val)
  }

  stream.current = subscribe(handleOnMessage)

  return (
    <div>
      <h1>React - Kafka Test</h1>
      <form action='#' onSubmit={() => handleProduceMessage(inputRef.current.value)}>
        <input ref={inputRef} />
      </form>
      <button onClick={() => setMessages({ test2: [], test1: [] })}>Clear topics</button>
      <div style={{ display: 'flex', justifyContent: 'space-evenly', padding: '0px 200px' }}>
        <div>
          <h2>Topic: test2</h2>
          {messages['test2'].map((d,i) => (
            <span key={`key-${d,i}`}>
              {d} ... Latency: {latencies['test2'][i]} <br />
            </span>
          ))}
        </div>
        <div>
          <h2>Topic: test1</h2>
          {messages['test1'].map((d) => (
            <span key={`key-${d}`}>
              {d} <br />
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

export default KafkaTest
