import { useState, useEffect, useContext } from 'react'
import { splitAngle, arrayAverage } from '../../preprocessing/windRoseMath'
import RadarChartVis from '../visualisation/RadarChartVis'
import StreamManager from '../ui/StreamManager'
import 'react-listbox/dist/react-listbox.css'

const RadarChartPage = ({ contextSettings, contextData, useInDashboard }) => {

  const refreshInterval = 200
  const mainStream = useContext(contextData)

  // Multiple sources and chart settings.
  const [radarChartData, setRadarChartData] = useState(null)
  const [radarDomain, setRadarDomain] = useState([])
  const [pendingUpdate, setPendingUpdate] = useState(0)
  var updateInterval

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
      var i

      for (i = 0; i < dirs.length; i++) {
        vals.push([])
      }

      for (i = 0; i < mainData["angle_1"].length; i++) {
        const ang = splitAngle(mainData["angle_1"][i].value, dirs.length)
        if (mainData["speed_1"][i]) {
          console.log(ang)
          if (!vals[ang]) {
            return
          }
          vals[ang].push(parseFloat(mainData["speed_1"][i].value))
        }
      }

      // Radar chart data.
      let radarData2 = {}
      let radarDomains = []
      const dirs2 = ['N', 'NNW', 'NW', 'WNW', 'W', 'WSW', 'SW', 'SSW', 'S', 'SSE', 'SE', 'ESE', 'E', 'ENE', 'NE', 'NNE']
      for (i = 0; i < dirs2.length; i++) {
        radarData2[dirs2[i]] = arrayAverage(vals[dirs2.length - (i)])
        radarDomains.push({
          name: dirs2[i], domain: [0, 6]
        })
        radarDomains[0].tickFormat = t => Math.round(t)
      }

      setRadarChartData([radarData2])
      setRadarDomain(radarDomains)

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

      {<RadarChartVis data={radarChartData} domains={radarDomain}></RadarChartVis>}
    </>
  )
}

export default RadarChartPage
