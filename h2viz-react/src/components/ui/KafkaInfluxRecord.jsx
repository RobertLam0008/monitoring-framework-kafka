
const KafkaInfluxRecord = ({ title, messages, latencies }) => {

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

  return (
    <>
    {messages && 
    <div style={{ padding: '10px', display: 'flex', height: '200px' }}>
      <h2 style={{ margin: 'auto 0px' }}>{title}</h2>

      <div style={{ margin: 'auto 0px', width: '100%', height: '200px' }}>
        {messages.length > 0 ?
          <span style={{ display: 'flex', justifyContent: 'space-evenly' }}>
            <h3>Data Entries: {messages.length}</h3>
            <h3>Average Latency: {+(latencies.reduce((a, b) => a + b) / latencies.length).toFixed(4)}</h3>
            <h3>Median Latency: {+(getMedian(latencies)).toFixed(4)}</h3>
            <h3>Standard Deviation: {+(getStandardDeviation(latencies)).toFixed(4)}</h3>
            <h3>Min Latency: {Math.max(0, Math.min(...latencies))}</h3>
            <h3>Max Latency: {Math.max(...latencies)}</h3>
          </span>
          : null}
        <div style={{ margin: 'auto 0px', width: '100%', height: '140px', overflowY: 'scroll' }}>
          {messages.map((d, i) => (
            <span style={{ display: 'flex', width: '100%', justifyContent: 'space-evenly' }} key={`key-${d, i}`}>
              <span><b>{d}</b></span>
              <span>Latency: {latencies[i]}</span>
              <br />
            </span>
          ))}
        </div>
      </div>
    </div>
    }
    </>
  )
}

export default KafkaInfluxRecord
