import React from 'react'
import { useState, createContext } from 'react';
import { Switch, Route, useHistory, useLocation } from "react-router-dom"
import Button from '@material/react-button'
import './App.scss'
import Tab from '@material/react-tab'
import MenuIcon from '@material-ui/icons/Menu'
import BarChartPage from './components/pages/BarChartPage'
import FFTChartPage from './components/pages/FFTChartPage'
import LineChartPage from './components/pages/LineChartPage'
import RadarChartPage from './components/pages/RadarChartPage'
import WindroseChartPage from './components/pages/WindroseChartPage'
import SampleDashboard from './components/pages/SampleDashboard'
import KafkaTest from './components/pages/KafkaTest'
import KafkaInflux from './components/pages/KafkaInflux';
import BenchTest from './components/pages/BenchTest';
import BoxChartPage from './components/pages/BoxChartPage'
import { SidebarComponent } from '@syncfusion/ej2-react-navigations'


const paths = ['/', '/linechart', '/barchart', '/fftchart', '/radarchart', '/windrose', '/boxplot', '/multi_series_test', '/kafka', '/kafkaInflux', '/benchmark']

const App = () => {

  const history = useHistory()
  const location = useLocation()

  // Data settings.
  const [refreshInterval, setRefreshInterval] = useState(200)
  const [windowStart, setWindowStart] = useState('0')
  const [windowLength, setWindowLength] = useState('60')
  const [smoothParameter, setSmoothParameter] = useState(0)
  const [smoothMethod, setSmoothMethod] = useState(() => null)
  const [smoothMethodText, setSmoothMethodText] = useState('')
  const [scaleType, setScaleType] = useState('linear')
  const [barWidth, setBarWidth] = useState(1)
  const [dataAxisRange, setDataAxisRange] = useState(null)
  const [rangeBound, setRangeBound] = useState([0.05, 0.95])
  const [showChartOptions, setShowChartOptions] = useState(true)
  const [showSourceManager, setShowSourceManager] = useState(false)
  const [timeStatic, setTimeStatic] = useState(false)
  const [sourceIDList, setSourceIDList] = useState([])  // Array of sourceIDs as string.
  const [sourceTables, setSourceTables] = useState({})  // Array of Dexie tables.
  const [version, setVersion] = useState(1) // Version to use.

  // Main streamed data.
  const [mainData, setMainData] = useState([])

  // Main sidebar setting.
  const [homeSidebarOpen, setHomeSidebarOpen] = useState(false)

  // Create context for adjusting cache data parameters.
  const dataSettings = {
    refreshInterval: refreshInterval,
    windowStart: windowStart,
    windowLength: windowLength,
    smoothParameter: smoothParameter,
    sourceIDList: sourceIDList,
    sourceTables: sourceTables,
    barWidth: barWidth,
    dataAxisRange: dataAxisRange,
    rangeBound: rangeBound,
    showChartOptions: showChartOptions,
    showSourceManager: showSourceManager,
    timeStatic: timeStatic,
    version: version,
    smoothMethod: smoothMethod,
    smoothMethodText: smoothMethodText,
    scaleType: scaleType,
    callbackApplyParams: null,
    callbackUpdateSource: null,
    callbackUpdateDisplay: null,
    callbackUpdateValueRange: null,
    callbackUpdateTimeRange: null,
    callbackUpdateSmoothingMethod: null,
    callbackUpdateRangePercentile: null,
    callbackUpdateBarWidth: null,
    callbackUpdateScaleType: null,
    callbackRefreshInterval: setRefreshInterval,
    callbackWindowStart: setWindowStart,
    callbackSmoothParameter: setSmoothParameter,
    callbackSmoothMethod: setSmoothMethod,
    callbackSmoothMethodText: setSmoothMethodText,
    callbackWindowLength: setWindowLength,
    callbackSourceIDList: setSourceIDList,
    callbackSourceTables: setSourceTables,
    callbackBarWidth: setBarWidth,
    callbackScaleType: setScaleType,
    callbackDataAxisRange: setDataAxisRange,
    callbackRangeBound: setRangeBound,
    callbackShowChartOptions: setShowChartOptions,
    callbackShowSourceManager: setShowSourceManager,
    callbackTimeStatic: setTimeStatic,
    callbackVersion: setVersion
  }

  const DataContext = createContext(dataSettings)

  // Manage streamed data.
  // Create context for adjusting cache data parameters.
  const streamedDataObj = {
    mainStreamedData: mainData,
    setMainStreamedData: setMainData
  }

  const streamedDataContext = createContext(streamedDataObj)

  return (
    <div className="App">

      {/* Home sidebar component to select page.*/}
      <SidebarComponent
        type={"Push"}
        isOpen={homeSidebarOpen}
        enableDock={true}
        dockSize={"72px"}
        width={"220px"}
        animate={false}
        enableGestures={false}
      >
        <Button onClick={() => setHomeSidebarOpen(!homeSidebarOpen)} icon={<MenuIcon></MenuIcon>}></Button>
        {homeSidebarOpen && <div className="menuContainer">
          {/* Handle different buttons that lead to their respective pages. */}
          <Tab active={paths.indexOf(location.pathname) === 0} onClick={() => history.push(paths[0])}>
            <span className='mdc-tab__text-label' to="/">Home</span>
          </Tab>
          <Tab active={paths.indexOf(location.pathname) === 1} onClick={() => history.push(paths[1])}>
            <span className='mdc-tab__text-label' to="/linechart">Line Chart</span>
          </Tab>
          <Tab active={paths.indexOf(location.pathname) === 2} onClick={() => history.push(paths[2])}>
            <span className='mdc-tab__text-label' to="/barchart">Bar Chart</span>
          </Tab>
          <Tab active={paths.indexOf(location.pathname) === 3} onClick={() => history.push(paths[3])}>
            <span className='mdc-tab__text-label' to="/fftchart">Frequency Chart</span>
          </Tab>
          <Tab active={paths.indexOf(location.pathname) === 4} onClick={() => history.push(paths[4])}>
            <span className='mdc-tab__text-label' to="/radarchart">Radar Chart</span>
          </Tab>
          <Tab active={paths.indexOf(location.pathname) === 5} onClick={() => history.push(paths[5])}>
            <span className='mdc-tab__text-label' to="/windrose">Windrose Chart</span>
          </Tab>
          <Tab active={paths.indexOf(location.pathname) === 6} onClick={() => history.push(paths[6])}>
            <span className='mdc-tab__text-label' to="/boxplot">Boxplot Chart</span>
          </Tab>
          <Tab active={paths.indexOf(location.pathname) === 7} onClick={() => history.push(paths[7])}>
            <span className='mdc-tab__text-label' to="/sample_dashboard">Sample Dashboard</span>
          </Tab>
          <Tab active={paths.indexOf(location.pathname) === 8} onClick={() => history.push(paths[8])}>
            <span className='mdc-tab__text-label' to="/kafka">Testing Kafka</span>
          </Tab>
          <Tab active={paths.indexOf(location.pathname) === 9} onClick={() => history.push(paths[9])}>
            <span className='mdc-tab__text-label' to="/kafka">Kafka and InfluxDB</span>
          </Tab>
          <Tab active={paths.indexOf(location.pathname) === 10} onClick={() => history.push(paths[10])}>
            <span className='mdc-tab__text-label' to="/benchmark">Benchmark Testing</span>
          </Tab>
        </div>}
      </SidebarComponent>

      {/* Handle routing to different pages. */}
      <Switch>
        <Route path="/linechart">
          <LineChartPage contextSettings={DataContext} contextData={streamedDataContext}/>
        </Route>
        <Route path="/barchart">
          <BarChartPage contextSettings={DataContext} contextData={streamedDataContext}/>
        </Route>
        <Route path="/fftchart">
          <FFTChartPage contextSettings={DataContext} contextData={streamedDataContext}/>
        </Route>
        <Route path="/radarchart">
          <RadarChartPage contextSettings={DataContext} contextData={streamedDataContext}/>
        </Route>
        <Route path="/windrose">
          <WindroseChartPage contextSettings={DataContext} contextData={streamedDataContext}/>
        </Route>
        <Route path="/boxplot">
          <BoxChartPage contextSettings={DataContext} contextData={streamedDataContext}/>
        </Route>
        <Route path="/multi_series_test">
          <SampleDashboard contextSettings={DataContext} contextData={streamedDataContext}/>
        </Route>
        <Route path="/kafka">
          <KafkaTest />
        </Route>
        <Route path="/kafkaInflux">
          <KafkaInflux/>
        </Route>
        <Route path="/benchmark">
          <BenchTest />
        </Route>
        <Route path="/">
          <div>Hello world!</div>
        </Route>
      </Switch>

    </div>
  )
}

export default App;
