import { useState, useContext } from 'react'
import Button from '@material/react-button'
import Select, { Option } from '@material/react-select'
import TextField, { Input } from '@material/react-text-field'
import HannWindow from '../../../preprocessing/hannWindow'
import HammingWindow from '../../../preprocessing/hammingWindow'
import TophatKernel from '../../../preprocessing/tophatKernel'

const SmoothingMethod = ({ contextSettings, displaySettings }) => {
  const [useKernel, setUseKernel] = useState(false)
  const [hanningLength, setHanningLength] = useState(256)
  const [kernelBandwidth, setKernelBandwidth] = useState(0.75)
  const [smoothFunction, setSmoothFunction] = useState('none')

  const regexFloats = /^\d*(?:[.]\d*)?$/
  const regexIntegers = /^\d*$/
  const settings = useContext(contextSettings)
  const displays = useContext(displaySettings)
  const filterRegex = (e, regex) => {
    return regex.test(e.target.value)
  }

  // Update context values - called each time we update display values (which are separate).
  settings.callbackUpdateSmoothingMethod = (settings) => {
    setHanningLength(settings.smoothParameter)
    setKernelBandwidth(settings.smoothParameter)
    setSmoothFunction(settings.smoothMethodText)
  }

  const onChange = (e) => {
    setSmoothFunction(e.target.value)

    // Update display based on whether we chose a kernel or a hann/hamming window.
    setUseKernel(e.target.selectedIndex > 2)
  }

  const applySmoothing = () => {
    // Check which function to use.
    let smooth
    switch (smoothFunction) {
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

    settings.callbackSmoothMethod(() => smooth)
    settings.callbackSmoothMethodText(smoothFunction)
    settings.callbackSmoothParameter(useKernel ? kernelBandwidth : hanningLength)
  }

  return (
    <div style={{ paddingTop: 25 }}>
      <h2>Smoothing Control</h2>

      <Select label='Smoothing method' value={smoothFunction} onChange={(e) => onChange(e)}>
        <Option value='none'>None</Option>
        <Option value='hannWindow'>Hann Window</Option>
        <Option value='hammingWindow'>Hamming Window</Option>
        <Option value='tophatKernel'>Tophat Kernel</Option>
      </Select>

      {!useKernel && <TextField label='Length of Hann/Hamming window'>
        <Input value={hanningLength} onChange={(e) => {
          if (filterRegex(e, regexIntegers)) {
            setHanningLength(e.currentTarget.value)
          }
        }}></Input>
      </TextField>}

      {useKernel && <TextField label='Bandwidth of tophat kernel'>
        <Input value={kernelBandwidth} onChange={(e) => {
          if (filterRegex(e, regexFloats)) {
            setKernelBandwidth(e.currentTarget.value)
          }
        }}></Input>
      </TextField>}

      <Button onClick={() => {
        applySmoothing()
      }}>Apply Smoothing</Button>
    </div>
  )
}

export default SmoothingMethod
