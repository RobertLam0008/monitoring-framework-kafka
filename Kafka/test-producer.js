const { Kafka } = require('kafkajs')
const fs = require("fs");
const { parse } = require("csv-parse");

const kafka = new Kafka({
  clientId: 'app',
  brokers: ['localhost:9092']
})

const pollingFreq = 500
const producer = kafka.producer()
let data = []
let data_2 = []
let startTime = Date.now()
let currentTime = 0

const getTimestamp = (date, time) => {
  const str = date.split('/')
  return Date.parse(`${str[1]}/${str[0]}/${str[2]} ${time}`) / 5000   // We won't wait an hour, so shorten time 5x.
}

const produce = async () => {
  const elapsed = Date.now() - startTime
  console.log(elapsed)

  const entries = data.filter(d => d.timestamp >= currentTime && d.timestamp < currentTime + elapsed)
  const entries_2 = data_2.filter(d => d.timestamp >= currentTime && d.timestamp < currentTime + elapsed)
  console.log(entries)
  currentTime += elapsed
  startTime = Date.now()

  await producer.send({
    topic: 'test2',
    messages: entries.map(d => ({
      value: `CO(GT): ${d.value},${Date.now()}`
    }))
  })

  await producer.send({
    topic: 'test3',
    messages: entries_2.map(d => ({
      value: `PT08.S1(CO): ${d.value},${Date.now()}`
    }))
  })

}

const main = async () => {
  // Sync current time with start of timestamp entry for test.
  currentTime = data[0].timestamp
  startTime = Date.now()
  await producer.connect()

  setInterval(produce, pollingFreq)
}

// Read stream.
fs.createReadStream("./AirQualityUCI.csv")
  .pipe(parse({ delimiter: ",", from_line: 2 }))
  .on("data", (d) => {
    data.push({
      timestamp: getTimestamp(d[0], d[1]),
      value: d[2]
    })
    data_2.push({
      timestamp: getTimestamp(d[0], d[1]),
      value: d[3]
    })
  })
  .on("close", () => {
    main()
  })