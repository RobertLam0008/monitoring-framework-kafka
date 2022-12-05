import { useState, useEffect, useContext, createContext } from 'react'
import { SidebarComponent } from '@syncfusion/ej2-react-navigations'
import ValueRange from './ChartParameters/ValueRange'
import TimeRange from './ChartParameters/TimeRange'
import SmoothingMethod from './ChartParameters/SmoothingMethod'
import BarWidth from './ChartParameters/BarWidth'
import RangePercentile from './ChartParameters/RangePercentile'
import LogScale from './ChartParameters/LogScale'

const ChartOptions = ({ contextSettings, values, time, smoothMethod, barWidth, bounds, scale }) => {
  const settings = useContext(contextSettings)
  const [currentTime, setCurrentTime] = useState(0)

  // For display.
  const [barWidthVal, setBarWidthVal] = useState(1)
  const [lowerBound, setLowerBound] = useState('0.05')
  const [upperBound, setUpperBound] = useState('0.95')
  const [useKernel, setUseKernel] = useState(false)
  const [hanningLength, setHanningLength] = useState(256)
  const [kernelBandwidth, setKernelBandwidth] = useState(0.75)
  const [smoothFunction, setSmoothFunction] = useState('none')
  const [sliderValue, setSliderValue] = useState([-60, 0])
  const [timeStart, setTimeStart] = useState('0')
  const [timeEnd, setTimeEnd] = useState('60')
  const [minDataRange, setMinDataRange] = useState('')
  const [maxDataRange, setMaxDataRange] = useState('')

  // Settings for the displayed values.
  // Create context for adjusting cache data parameters.
  const displayedSettings = {
    timeStart: timeStart,
    timeEnd: timeEnd,
    hanningLength: hanningLength,
    kernelBandwidth: kernelBandwidth,
    barWidthVal: barWidthVal,
    minDataRange: minDataRange,
    maxDataRange: maxDataRange,
    lowerBound: lowerBound,
    upperBound: upperBound,
    smoothFunction: smoothFunction,
    sliderValue: sliderValue,
    useKernel: useKernel,
    setUseKernel: setUseKernel,
    setSliderValue: setSliderValue,
    setTimeStart: setTimeStart,
    setHanningLength: setHanningLength,
    setKernelBandwidth: setKernelBandwidth,
    setSmoothFunction: setSmoothFunction,
    setTimeEnd: setTimeEnd,
    setBarWidthVal: setBarWidthVal,
    setMinDataRange: setMinDataRange,
    setMaxDataRange: setMaxDataRange,
    setLowerBound: setLowerBound,
    setUpperBound: setUpperBound
  }

  const displayContext = createContext(displayedSettings)
  const displays = useContext(displayContext)

  // Reflect data changes to displays.
  settings.callbackUpdateDisplay = (settings) => {
    displays.setTimeStart(settings.windowStart)
    displays.setTimeEnd(settings.windowLength)
    displays.setHanningLength(settings.smoothParameter)
    displays.setKernelBandwidth(settings.smoothParameter)
    displays.setBarWidthVal(settings.barWidth)
    displays.setMinDataRange(settings.dataAxisRange[0])
    displays.setMaxDataRange(settings.dataAxisRange[1])
    displays.setLowerBound(settings.rangeBound[0])
    displays.setUpperBound(settings.rangeBound[1])
    displays.setSmoothFunction(settings.smoothMethodText)
    displays.setSliderValue([-settings.timeStart, settings.timeEnd])
    console.log("Updated displays!")
    console.log(settings.dataAxisRange)
    console.log(displays.minDataRange, displays.maxDataRange)
  }
  

  // On mount.
  useEffect(() => {
    // Get start time.
    setCurrentTime(Date.now())
  }, [])

  return (
    <SidebarComponent
      type={"Over"}
      isOpen={settings.showChartOptions}
      position={"Right"}
      width={"330px"}
      animate={false}
      enableGestures={false}
    >
      <br></br>
      <div>
        {values && <ValueRange contextSettings={contextSettings} displaySettings={displayContext}></ValueRange>}
        {time && <TimeRange contextSettings={contextSettings} timeRange={[currentTime, Date.now()]} displaySettings={displayContext}></TimeRange>}
        {smoothMethod && <SmoothingMethod contextSettings={contextSettings} displaySettings={displayContext}/>}
        {barWidth && <BarWidth contextSettings={contextSettings} displaySettings={displayContext}/>}
        {bounds && <RangePercentile contextSettings={contextSettings} displaySettings={displayContext}/>}
        {scale && <LogScale contextSettings={contextSettings} />}
      </div>

    </SidebarComponent>
  )
}

export default ChartOptions
