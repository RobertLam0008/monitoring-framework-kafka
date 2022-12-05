import { useState, useRef, useEffect, useContext } from 'react'
import BoxPlot from '../visualisation/BoxPlot'
import StreamManager from '../ui/StreamManager'
import 'react-listbox/dist/react-listbox.css'

const BoxChartPage = ({ contextSettings, contextData, useInDashboard }) => {

  const settings = useContext(contextSettings)
  const mainStream = useContext(contextData)

  // Multiple sources and chart settings.
  const [boxPlotData, setBoxPlotData] = useState([])
  const [pendingUpdate, setPendingUpdate] = useState(0)
  var updateInterval

  // Update database and apply any preprocessing.
  const prepareData = async (d) => {

    const mainData = mainStream.mainStreamedData

    // If we have no data, we can't prepare.
    if (!mainData) return

    const boxData = Object.keys(mainData).map((source, i) => {
      if (!mainData[source]) return null
      let rawVals = mainData[source].map((d) => d.value).sort((a, b) => a - b)

      // _yHigh and _yLow are interchangable, since they act as bounds on either side.
      const _yHigh = rawVals[Math.floor(rawVals.length * settings.rangeBound[0])]
      const _yLow = rawVals[Math.floor(rawVals.length * settings.rangeBound[1])]
      return {
        name: source,
        x: i + 1,
        y: rawVals[Math.floor(rawVals.length / 2)],
        yHigh: _yHigh,
        yClose: rawVals[Math.floor(rawVals.length * 0.25)],
        yOpen: rawVals[Math.floor(rawVals.length * 0.75)],
        yLow: _yLow,
        outliers: rawVals.filter((d) => d > Math.max(_yHigh, _yLow) || d < Math.min(_yLow, _yHigh))
      }
    })

    setBoxPlotData(boxData)

  }

  // On mount.
  useEffect(() => {
    // Initialise counter.
    updateInterval = setInterval(() => {
      setPendingUpdate((s) => s + 1)
    }, settings.refreshInterval)

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
        values time smoothMethod bounds
      />}

      {boxPlotData && <BoxPlot data={boxPlotData} range={settings.dataAxisRange}></BoxPlot>}
    </>
  )
}

export default BoxChartPage
