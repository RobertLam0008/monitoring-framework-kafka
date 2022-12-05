import { useState, useContext } from 'react'
import Select, { Option } from '@material/react-select'

const ChartSelector = ({ contextChart, id }) => {

  const activeCharts = useContext(contextChart)

  // On option change, update the active chart.
  const onChange = (e) => {
    const id = parseInt(e.target.id)
    let actives = activeCharts.activeCharts.slice()
    actives[id] = e.target.value

    activeCharts.setActiveCharts(actives)
  }

  return (
    <>
      <div style={{marginLeft: "-1300px"}}>
      <Select label={`Graph ${id+1}`} value={activeCharts.activeCharts[id]} id={id} onChange={(e) => onChange(e)}>
        <Option value=''></Option>
        <Option value='line'>Line chart</Option>
        <Option value='bar'>Bar chart</Option>
        <Option value='radar'>Radar chart</Option>
        <Option value='fft'>FFT Line chart</Option>
        <Option value='windrose'>Windrose chart</Option>
        <Option value='box'>Box chart</Option>
      </Select>
      </div>
    
    </>
  )
}

export default ChartSelector
