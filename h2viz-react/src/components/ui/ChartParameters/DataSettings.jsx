import { useContext } from 'react'
import Button from '@material/react-button'
import Select, { Option } from '@material/react-select'
import TextField, { Input } from '@material/react-text-field'

const DataSettings = ({ contextSettings, line, bar, fft }) => {
  const regexFloats = /^\d*(?:[.]\d*)?$/
  const regexIntegers = /^\d*$/
  const settings = useContext(contextSettings)

  // Use regex to check for valid user input.
  const filterRegex = (e, regex) => {
    return regex.test(e.target.value)
  }

  const tryParseFloat = (d) => {
    const output = parseFloat(d)
    if (output) return output
    return d
  }

  return (
    <div>
      <TextField label='Length of time window'>
        <Input value={settings.windowLength} onChange={(e) => {
          if (filterRegex(e, regexFloats)) {
            settings.callbackWindowLength(e.currentTarget.value)
          }
        }}></Input>
      </TextField>
      <TextField label='Data source ID'>
        <Input value={settings.sourceID} onChange={(e) => settings.callbackSourceID(e.currentTarget.value)}></Input>
      </TextField>
      {(fft || line) && <Select label='Smoothing method' value={settings.smoothMethod} onChange={(e) => settings.callbackSmoothWindow(e.target.value)}>
        <Option value='none'>None</Option>
        {fft && <Option value='hannWindow'>Hann Window</Option>}
        {fft && <Option value='hammingWindow'>Hamming Window</Option>}
        {line && <Option value='tophatKernel'>Tophat Kernel</Option>}
      </Select>}
      {fft && <TextField label='Length of Hann/Hamming window'>
        <Input value={settings.hanningLength} onChange={(e) => {
          if (filterRegex(e, regexIntegers)) {
            settings.callbackHanningLength(e.currentTarget.value)
          }
        }}></Input>
      </TextField>}
      {line && <TextField label='Bandwidth of tophat kernel'>
        <Input value={settings.kernelBandwidth} onChange={(e) => {
          if (filterRegex(e, regexFloats)) {
            settings.callbackKernelBandwidth(e.currentTarget.value)
          }
        }}></Input>
      </TextField>}
      {bar && <TextField label='Width of bar in seconds'>
        <Input value={settings.barWidth} onChange={(e) => {
          if (filterRegex(e, regexIntegers)) {
            settings.callbackBarWidth(tryParseFloat(e.currentTarget.value))
          }
        }}></Input>
      </TextField>}
      <br></br>
      <Button onClick={() => settings.callbackApplyParams()}>Apply Changes</Button>
    </div>
  )
}

export default DataSettings
