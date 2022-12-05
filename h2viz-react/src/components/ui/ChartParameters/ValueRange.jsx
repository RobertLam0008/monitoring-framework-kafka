import { useState, useContext } from 'react'
import Button from '@material/react-button'
import TextField, { Input } from '@material/react-text-field'

const ValueRange = ({ contextSettings, displaySettings }) => {
  const [minDataRange, setMinDataRange] = useState('')
  const [maxDataRange, setMaxDataRange] = useState('')
  const regexFloats = /^\d*(?:[.]\d*)?$/
  const settings = useContext(contextSettings)
  const displays = useContext(displaySettings)
  const filterRegex = (e, regex) => {
    return regex.test(e.target.value)
  }

  settings.callbackUpdateValueRange = (settings) => {
    if (!settings.dataAxisRange) return
    setMinDataRange(settings.dataAxisRange[0])
    setMaxDataRange(settings.dataAxisRange[1])
  }

  const validateRange = () => {
    // Setup range.
    let range = [minDataRange, maxDataRange]
    if (range[0] === null || (range[0] === '' && range[1] === '')) {
      range = null
    }
    else {
      range = [parseFloat(range[0]), parseFloat(range[1])]
    }

    return range
  }

  return (
    <div style={{ paddingTop: 25 }}>
      <h2>Value Range</h2>

      <TextField label='Minimum data range'>
        <Input value={minDataRange} onChange={(e) => {
          if (filterRegex(e, regexFloats)) {
            setMinDataRange(e.currentTarget.value)
          }
        }}></Input>
      </TextField>
      <TextField label='Maximum data range'>
        <Input value={maxDataRange} onChange={(e) => {
          if (filterRegex(e, regexFloats)) {
            setMaxDataRange(e.currentTarget.value)
          }
        }}></Input>
      </TextField>
      <Button onClick={e => settings.callbackDataAxisRange(validateRange())}> Apply Range </Button>
      <Button onClick={() => {
        setMinDataRange('')
        setMaxDataRange('')
        settings.callbackDataAxisRange(null)
      }}> Auto Range </Button>

    </div>
  )
}

export default ValueRange
