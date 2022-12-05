import { useState, useRef, useEffect, useContext, createContext } from 'react'
import { subscribe } from '../../clients/windspeed'
import { appendData, newCache, clearCache, getFilteredData } from '../../preprocessing/seriesCache'
import ChartOptions from '../ui/ChartOptions'
import SourcesManager from '../ui/SourcesManager'
import VisPageHead from '../ui/VisPageHead'
import 'react-listbox/dist/react-listbox.css'

const StreamManager = ({ contextSettings, contextData, values, time, smoothMethod, barWidth, bounds, scale }) => {

  const refreshInterval = 200
  const settings = useContext(contextSettings)
  const mainStream = useContext(contextData)

  const stream = useRef(null)
  const [dataCleared, setDataCleared] = useState(false)
  const [subscribed, setSubscribed] = useState(false)

  // Multiple sources and chart settings.
  const [binding, setBinding] = useState(false)
  const [pendingUpdate, setPendingUpdate] = useState(0)
  var updateInterval

  let db = null
  if (dataCleared) {
    db = newCache('multiSeries', settings.sourceTables, settings.version)
  }

  const bindChanges = () => {
    console.log("Apply params")
    if (stream.current) {
      stream.current.stop()
      stream.current = null
    }
    setBinding(!binding)
  }

  settings.callbackApplyParams = bindChanges

  const onClick = async (e) => {
    // Subscribe to coinbase.
    if (!subscribed) {
      // On subscribe, clear data.
      setSubscribed(true)
      bindChanges()
    } else {
      // Stop data stream.
      if (stream.current) {
        stream.current.stop()
        stream.current = null
      }
      setSubscribed(false)
      if (updateInterval) clearInterval(updateInterval)
    }
  }

  // Update database and apply any preprocessing.
  const updateDatabase = async (d) => {

    let seriesDataMap = await getFilteredData(db, settings)

    // If we have no data, we can't update.
    if (!seriesDataMap) return

    mainStream.setMainStreamedData(seriesDataMap)
  }

  // On mount.
  useEffect(() => {
    // Delete database on page load.
    console.log("Cleared database")
    clearCache('multiSeries')
    settings.callbackVersion(1)
    setDataCleared(true)

    // Initialise counter.
    updateInterval = setInterval(() => {
      setPendingUpdate((s) => s + 1)
    }, refreshInterval)

    // Cleanup function to prevent memory leak.
    return () => {
      console.log("Cleanup")
      if (stream.current) {
        stream.current.stop()
        stream.current = null
      }
      setSubscribed(false)
      clearInterval(updateInterval)
      clearCache('multiSeries')
    }
  }, [])

  // On refresh.
  useEffect(() => {
    if (subscribed) {
      updateDatabase()
    }
  }, [pendingUpdate])

  // On stream update.
  useEffect(() => {
    if (subscribed && !stream.current) {
      // Subscribe to websocket and stream in data.
      stream.current = subscribe(settings.sourceIDList.map((d) => d.name), "", (dataObj) => {
        if (stream.current) {
          // Get table with the same name as the source ID.
          const currentTable = db.tables.filter((t) => t.name === dataObj.measurement)[0]
          if (currentTable) {
            // If we found it, add the data to that table.
            appendData(dataObj, currentTable)
          }

        }
      })
    }

  }, [subscribed, db, settings.sourceIDList, settings.version, settings.windowLength, settings.windowStart, updateDatabase])

  return (
    <>

      {/* Chart settings */}
      <ChartOptions
        contextSettings={contextSettings}
        values time smoothMethod barWidth bounds scale
      />

      {/* Head with buttons to control chart. */}
      <VisPageHead
        contextSettings={contextSettings}
        subscribed={subscribed}
        onClick={onClick}
      />

      {/* Modal to manage data sources. */}
      <SourcesManager
        contextSettings={contextSettings}
      />

    </>
  )
}

export default StreamManager
