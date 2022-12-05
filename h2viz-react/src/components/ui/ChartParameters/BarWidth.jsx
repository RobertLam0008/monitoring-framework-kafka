import { useState, useContext } from 'react'
import Button from '@material/react-button'
import TextField, { Input } from '@material/react-text-field'

const BarWidth = ({ contextSettings, displaySettings }) => {
  const [barWidth, setBarWidth] = useState(1)

  const regexIntegers = /^\d*$/
  const tryParseFloat = (d) => {
    const output = parseFloat(d)
    if (output) return output
    return d
  }
  const settings = useContext(contextSettings)
  const filterRegex = (e, regex) => {
    return regex.test(e.target.value)
  }

  const applyBarWidth = () => {
    settings.callbackBarWidth(tryParseFloat(barWidth))
  }

  settings.callbackUpdateBarWidth = (settings) => {
    if (!settings.rangeBound) return
    setBarWidth(settings.barWidth)
  }

  return (
    <div style={{ paddingTop: 25, paddingBottom: 25 }}>
      <h2>Bar Width</h2>

      <TextField label='Width of bar in seconds'>
        <Input value={barWidth} onChange={(e) => {
          if (filterRegex(e, regexIntegers)) {
            setBarWidth(tryParseFloat(e.currentTarget.value))
          }
        }}></Input>
      </TextField>

      <Button onClick={() => {
        applyBarWidth()
      }}>Apply Bar Width</Button>
    </div>
  )
}

export default BarWidth
