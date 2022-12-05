import { useState, useEffect, useContext } from 'react'
import Button from '@material/react-button'
import { Slider } from '@material-ui/core';
import TextField, { Input } from '@material/react-text-field'

const TimeRange = ({ contextSettings, timeRange, displaySettings }) => {
  const [sliderValue, setSliderValue] = useState([-60, 0])
  const [timeStart, setTimeStart] = useState('0')
  const [timeEnd, setTimeEnd] = useState('60')
  const regexFloats = /^\d*(?:[.]\d*)?$/
  const settings = useContext(contextSettings)

  // Helper functions.
  const filterRegex = (e, regex) => {
    return regex.test(e.target.value)
  }
  const formatDate = (d, idx) => {
    if (!settings.timeStatic) {
      return Math.abs(sliderValue[idx])
    }

    return new Date(d).toLocaleTimeString()
  }

  settings.callbackUpdateTimeRange = (settings) => {
    const start = settings.windowStart/1000
    const end = settings.windowLength/1000
    setSliderValue([start,end])
  }

  const minTime = settings.timeStatic ? timeRange[0] : -60
  const maxTime = settings.timeStatic ? timeRange[1] : 0

  const updateStatic = (v1, v2) => {
    if (settings.timeStatic) {
      setTimeStart(Math.abs(v1))
      setTimeEnd(Math.abs(v2))
      setSliderValue([Math.abs(v1), Math.abs(v2)])
    }
    else {
      setTimeStart(v1 * 1000)
      setTimeEnd(v2 * 1000)
      setSliderValue([v1, v2])
    }
  }

  const applyChanges = () => {
    settings.callbackWindowStart(timeStart)
    settings.callbackWindowLength(timeEnd)
  }

  useEffect(() => {
    // On mount, update default values.
    settings.callbackTimeStatic(false)
    settings.callbackWindowStart(sliderValue[0] * 1000)
    settings.callbackWindowLength(sliderValue[1] * 1000)
  }, [])

  useEffect(() => {
    // Refresh on static change.
    updateStatic(minTime, maxTime)
    const mult = settings.timeStatic ? 1 : 1000
    settings.callbackWindowStart(minTime * mult)
    settings.callbackWindowLength(maxTime * mult)
  }, [settings.timeStatic])

  return (
    <div style={{ paddingTop: 25 }}>
      <h2>Time Range</h2>

      {<TextField label='Start of time window:'>
        <Input value={formatDate(timeStart, 0)} onChange={(e) => {
          if (filterRegex(e, regexFloats)) {
            setTimeStart(e.currentTarget.value)
          }
        }}></Input>
      </TextField>}

      {<TextField label='End of time window:'>
        <Input value={formatDate(timeEnd, 1)} onChange={(e) => {
          if (filterRegex(e, regexFloats)) {
            setTimeEnd(e.currentTarget.value)
          }
        }}></Input>
      </TextField>}

      <div style={{ paddingLeft: 50, paddingRight: 50 }}>
        <Slider value={sliderValue} min={minTime} max={maxTime} onChange={(e, value) => {
          updateStatic(value[0], value[1])
        }} />
      </div>

      <Button onClick={() => applyChanges()}>Apply Time Range</Button>
      <br></br>
      <Button onClick={() => { settings.callbackTimeStatic(!settings.timeStatic) }}> Change to {settings.timeStatic ? "Dynamic" : "Static"}</Button>
    </div>
  )
}

export default TimeRange
