import { useState, useEffect, useContext } from 'react'
import { rfft } from '../../signal/fft'
import FFTMultiLineChart from '../visualisation/FFTMultiLineChart'
import StreamManager from '../ui/StreamManager'
import 'react-listbox/dist/react-listbox.css'

const FFTChartPage = ({ contextSettings, contextData, useInDashboard }) => {

  const refreshInterval = 200
  const settings = useContext(contextSettings)
  const mainStream = useContext(contextData)

  // Multiple sources and chart settings.
  const [seriesData, setSeriesData] = useState({})  // Stores all data.
  const [seriesLegend, setSeriesLegend] = useState([])
  const [pendingUpdate, setPendingUpdate] = useState(0)
  var updateInterval

  // Update database and apply any preprocessing.
  const prepareData = async (d) => {
    const mainData = mainStream.mainStreamedData

    // If we have no data, we can't prepare.
    if (!mainData) return

    const legendData = Object.keys(mainData)
    const fftData = legendData.map((source, i) => {
      return rfft(mainData[source].map((d) => d.value), 1)
        .filter(d => d.amplitude < 10)
    })

    setSeriesData(fftData)
    setSeriesLegend(legendData)
  }

  // On mount.
  useEffect(() => {
    // Initialise counter.
    updateInterval = setInterval(() => {
      setPendingUpdate((s) => s + 1)
    }, refreshInterval)

    // Cleanup function to prevent memory leak.
    return () => {
      clearInterval(updateInterval)
    }
  }, [])

  // On refresh.
  useEffect(() => {
    prepareData()
  }, [pendingUpdate])

  return (
    <>
      {!useInDashboard && <StreamManager
        contextSettings={contextSettings}
        contextData={contextData}
        values time smoothMethod scale
      />}

      {seriesData && <FFTMultiLineChart range={settings.dataAxisRange} data={seriesData} legend={seriesLegend}></FFTMultiLineChart>}
    </>
  )
}

export default FFTChartPage
