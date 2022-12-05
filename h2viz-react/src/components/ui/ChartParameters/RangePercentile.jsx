import { useState, useContext } from 'react'
import Button from '@material/react-button'
import TextField, { Input } from '@material/react-text-field'

const RangePercentile = ({ contextSettings, displaySettings }) => {
  const [lowerBound, setLowerBound] = useState('0.05')
  const [upperBound, setUpperBound] = useState('0.95')
  const regexFloats = /^\d*(?:[.]\d*)?$/
  const settings = useContext(contextSettings)
  const displays = useContext(displaySettings)
  const filterRegex = (e, regex) => {
    return regex.test(e.target.value)
  }

  const validateBound = (bound) => {
    return Math.max(Math.min(1, parseFloat(bound)), 0)
  }

  // Update context values.
  settings.callbackUpdateRangePercentile = (settings) => {
    if (!settings.rangeBound) return
    setLowerBound(settings.rangeBound[0])
    setUpperBound(settings.rangeBound[1])
  }

  return (
    <div style={{ paddingTop: 25 }}>
      <h2>Box Plot Percentiles</h2>

      <TextField label='Lower bound'>
        <Input value={lowerBound} onChange={(e) => {
          if (filterRegex(e, regexFloats)) {
            setLowerBound(e.currentTarget.value)
          }
        }}></Input>
      </TextField>
      <TextField label='Upper bound'>
        <Input value={upperBound} onChange={(e) => {
          if (filterRegex(e, regexFloats)) {
            setUpperBound(e.currentTarget.value)
          }
        }}></Input>
      </TextField>
      <Button onClick={e => settings.callbackRangeBound([validateBound(lowerBound), validateBound(upperBound)])}> Apply Range </Button>

    </div>
  )
}

export default RangePercentile
