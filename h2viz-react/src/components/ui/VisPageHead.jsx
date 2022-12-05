import { useContext } from 'react'
import Button from '@material/react-button'
import Dexie from 'dexie'
import HannWindow from '../../preprocessing/hannWindow'
import HammingWindow from '../../preprocessing/hammingWindow'
import TophatKernel from '../../preprocessing/tophatKernel'

const VisPageHead = ({ contextSettings, subscribed, onClick }) => {
  const settings = useContext(contextSettings)

  const db = new Dexie('configs')
  db.version(1).stores({
    config: "id"
  })

  const saveSettings = () => {

    const savedSettings = {
      windowStart: settings.windowStart,
      windowLength: settings.windowLength,
      smoothParameter: settings.smoothParameter,
      sourceIDList: settings.sourceIDList,
      sourceTables: settings.sourceTables,
      barWidth: settings.barWidth,
      dataAxisRange: settings.dataAxisRange,
      rangeBound: settings.rangeBound,
      timeStatic: settings.timeStatic,
      smoothMethodText: settings.smoothMethodText
    }

    // Try create JSON file output.
    const JSONSettings = JSON.stringify(savedSettings)

    // Create temp html attribute to download with.
    let temp = document.createElement('a')
    temp.href = 'data:attachment/json,' + encodeURIComponent(JSONSettings)
    temp.download = 'outConfig.json'
    document.body.appendChild(temp)
    temp.click()
    document.body.removeChild(temp)

  }

  const loadSettings = () => {
    let temp = document.createElement('input')
    temp.type = 'file'
    temp.accept = '.json'
    temp.onchange = () => {
      const config = Array.from(temp.files)[0]
      const reader = new FileReader()
      reader.onload = (e) => {
        const loadedSettings = JSON.parse(e.target.result)
        applyLoadedSettings(loadedSettings)
      }
      reader.readAsText(config)
    }
    temp.click();
  }

  const applyLoadedSettings = (config) => {
    let smooth
    switch (config.smoothMethodText) {
      case "hannWindow": {
        smooth = HannWindow
        break
      }
      case "hammingWindow": {
        smooth = HammingWindow
        break
      }
      case "tophatKernel": {
        smooth = TophatKernel
        break
      }
      default: smooth = null
    }

    settings.callbackWindowStart(config.windowStart)
    settings.callbackWindowLength(config.windowLength)
    settings.callbackSmoothParameter(config.smoothParameter)
    settings.callbackSmoothMethod(() => smooth)
    settings.callbackSourceIDList(config.sourceIDList)
    settings.callbackSourceTables(config.sourceTables)
    settings.callbackBarWidth(config.barWidth)
    settings.callbackDataAxisRange(config.dataAxisRange)
    settings.callbackRangeBound(config.rangeBound)
    settings.callbackTimeStatic(config.timeStatic)
    settings.callbackVersion(settings.version + 1)
    if (settings.callbackUpdateValueRange) settings.callbackUpdateValueRange(config)
    if (settings.callbackUpdateTimeRange) settings.callbackUpdateTimeRange(config)
    if (settings.callbackUpdateSmoothingMethod) settings.callbackUpdateSmoothingMethod(config)
    if (settings.callbackUpdateRangePercentile) settings.callbackUpdateRangePercentile(config)
    if (settings.callbackUpdateBarWidth) settings.callbackUpdateBarWidth(config)
    settings.callbackApplyParams()
  }

  return (
    <div>
      <Button onClick={e => onClick(e)}>{subscribed ? "Unsubscribe" : "Subscribe"} Data </Button>
      {<Button onClick={() => saveSettings()}>Save Configuration</Button>}
      {<Button onClick={() => loadSettings()}>Load Configuration</Button>}
      <Button onClick={() => settings.callbackShowChartOptions(!settings.showChartOptions)}>{settings.showChartOptions ? "Hide" : "Show"} Chart Settings </Button>
    </div>
  )
}

export default VisPageHead
