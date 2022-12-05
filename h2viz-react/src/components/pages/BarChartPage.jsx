import { useState, useEffect, useContext } from 'react'
import { prepareSingleSeries } from '../../preprocessing/seriesCache'
import MultiBarChart from '../visualisation/MultiBarChart'
import StreamManager from '../ui/StreamManager'
import 'react-listbox/dist/react-listbox.css'

const BarChartPage = ({ contextSettings, contextData, useInDashboard }) => {

  const refreshInterval = 200
  const settings = useContext(contextSettings)
  const mainStream = useContext(contextData)

  // Multiple sources and chart settings.
  const [seriesData, setSeriesData] = useState({})  // Stores all data.
  const [seriesLegend, setSeriesLegend] = useState([])
  const [pendingUpdate, setPendingUpdate] = useState(0)
  var updateInterval

  const prepareData = () => {
    const mainData = mainStream.mainStreamedData

    // If we have no data, we can't prepare.
    if (!mainData) return

    // Bar data formatting.
    const legendData = Object.keys(mainData)
    const barData = legendData.map((source, i) => {
      return prepareSingleSeries(mainData[source], settings.barWidth * 1000, 0).map(d => {
        return {
          x0: d.timestamp,
          x: d.timestamp + settings.barWidth * 1000,
          y: d.value
        }
      })
    })

    setSeriesData(barData)
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
        values time smoothMethod barWidth scale
      />}

      {seriesData && <MultiBarChart range={settings.dataAxisRange} data={seriesData} legend={seriesLegend}></MultiBarChart>}
    </>
  )
}

export default BarChartPage
