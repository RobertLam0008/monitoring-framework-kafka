import { useState, useEffect, useContext } from 'react'
import MultiLineChart from '../visualisation/MultiLineChart'
import StreamManager from '../ui/StreamManager'
import 'react-listbox/dist/react-listbox.css'

const LineChartPage = ({ contextSettings, contextData, useInDashboard}) => {

  const refreshInterval = 200
  const mainStream = useContext(contextData)

  // Multiple sources and chart settings.
  const [seriesData, setSeriesData] = useState({})  // Stores all data.
  const [pendingUpdate, setPendingUpdate] = useState(0)
  var updateInterval

  const prepareData = () => {
    const mainData = mainStream.mainStreamedData
    
    // If we have no data, we can't prepare.
    if (!mainData) return

    setSeriesData(mainData)
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

      {seriesData && <MultiLineChart contextSettings={contextSettings} data={seriesData}></MultiLineChart>}

    </>
  )
}

export default LineChartPage
