import { useState, useEffect, useContext } from 'react'
import { splitAngle, splitInterval, arrayAverage } from '../../preprocessing/windRoseMath'
import WindRoseChart from '../visualisation/WindRoseChart'
import StreamManager from '../ui/StreamManager'
import 'react-listbox/dist/react-listbox.css'

const WindroseChartPage = ({ contextSettings, contextData, useInDashboard }) => {

  const refreshInterval = 200
  const mainStream = useContext(contextData)

  // Multiple sources and chart settings.
  const [windRoseData, setWindRoseData] = useState(null)
  const [pendingUpdate, setPendingUpdate] = useState(0)
  var updateInterval

  const windSources = [
    { value: 'val1', name: '0-0.75 m/s' },
    { value: 'val2', name: '0.75-1.5 m/s' },
    { value: 'val3', name: '1.5-2.25 m/s' },
    { value: 'val4', name: '2.25-3 m/s' },
    { value: 'val5', name: '3-3.75 m/s' },
    { value: 'val6', name: '3.75-4.5 m/s' },
    { value: 'val7', name: '4.5-5.25 m/s' },
    { value: 'val8', name: '5.25-6 m/s' }
  ]

  // Update database and apply any preprocessing.
  const prepareData = async (d) => {

    const mainData = mainStream.mainStreamedData

    // If we have no data, we can't prepare.
    if (!mainData) return

    // Only concern ourselves with speed_1 and angle_1.
    if (mainData["angle_1"] && mainData["speed_1"]) {
      // Wind rose data.
      const dirs = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW']
      var vals = []
      var angledData = []
      var i

      for (i = 0; i < dirs.length; i++) {
        vals.push([])
      }

      for (i = 0; i < mainData["angle_1"].length; i++) {
        const ang = splitAngle(mainData["angle_1"][i].value, dirs.length)
        if (mainData["speed_1"][i]) {
          if (!vals[ang]) {
            return
          }
          vals[ang].push(parseFloat(mainData["speed_1"][i].value))
        }
      }


      for (i = 0; i < dirs.length; i++) {
        const speeds = splitInterval(arrayAverage(vals[i]), 0.75, 8)
        angledData.push({
          arg: dirs[i],
          val1: speeds[0],
          val2: speeds[1],
          val3: speeds[2],
          val4: speeds[3],
          val5: speeds[4],
          val6: speeds[5],
          val7: speeds[6],
          val8: speeds[7]
        })
      }

      setWindRoseData(angledData)

    }

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
        time smoothMethod
      />}

      {windRoseData && <WindRoseChart data={windRoseData} columns={windSources}></WindRoseChart>}
    </>
  )
}

export default WindroseChartPage
