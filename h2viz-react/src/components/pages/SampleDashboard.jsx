import { useState, createContext } from 'react'
import StreamManager from '../ui/StreamManager'
import ChartSelector from '../ui/ChartSelector'
import LineChartPage from './LineChartPage'
import WindroseChartPage from './WindroseChartPage'
import RadarChartPage from './RadarChartPage'
import BoxChartPage from './BoxChartPage'
import FFTChartPage from './FFTChartPage'
import BarChartPage from './BarChartPage'

const SampleDashboard = ({ contextSettings, contextData }) => {

  // States to store chart options.
  const [activeCharts, setActiveCharts] = useState(['','','',''])

  // Manage charts
  // Create context for charts.
  const activeChartObj = {
    activeCharts: activeCharts,
    setActiveCharts: setActiveCharts
  }

  const activeChartContext = createContext(activeChartObj)

  // Charts that can be used in the dashboard:
  const lineChart = <LineChartPage contextSettings={contextSettings} contextData={contextData} useInDashboard={true} />
  const barChart = <BarChartPage contextSettings={contextSettings} contextData={contextData} useInDashboard={true} />
  const radarChart = <RadarChartPage contextSettings={contextSettings} contextData={contextData} useInDashboard={true} />
  const fftChart = <FFTChartPage contextSettings={contextSettings} contextData={contextData} useInDashboard={true} />
  const windroseChart = <WindroseChartPage contextSettings={contextSettings} contextData={contextData} useInDashboard={true} />
  const boxChart = <BoxChartPage contextSettings={contextSettings} contextData={contextData} useInDashboard={true} />

  const chartsMap = {
    '': null,
    'line': lineChart,
    'bar': barChart,
    'radar': radarChart,
    'fft': fftChart,
    'windrose': windroseChart,
    'box': boxChart
  }

  return (
    <>
      <StreamManager
        contextSettings={contextSettings}
        contextData={contextData}
        values time smoothMethod scale
      />

      <ChartSelector contextChart={activeChartContext} id={0}/>
      {chartsMap[activeCharts[0]]}

      <ChartSelector contextChart={activeChartContext} id={1}/>
      {chartsMap[activeCharts[1]]}

      <ChartSelector contextChart={activeChartContext} id={2}/>
      {chartsMap[activeCharts[2]]}

      <ChartSelector contextChart={activeChartContext} id={3}/>
      {chartsMap[activeCharts[3]]}

    </>
  )
}

export default SampleDashboard
