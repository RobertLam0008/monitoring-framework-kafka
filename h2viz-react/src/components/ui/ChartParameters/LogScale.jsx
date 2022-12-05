import { useState, useContext } from 'react'
import Button from '@material/react-button'
import Select, { Option } from '@material/react-select'

const LogScale = ({ contextSettings }) => {
  const [scaleType, setScaleType] = useState('linear')

  const settings = useContext(contextSettings)

  settings.callbackUpdateScaleType= (settings) => {
    setScaleType(settings.scaleType)
  }

  const onChange = (e) => {
    setScaleType(e.target.value)
  }

  const applyScale = () => {
    // Update scale type.
    settings.callbackScaleType(scaleType)
  }

  return (
    <div style={{ paddingTop: 25 }}>
      <h2>Scale Type</h2>

      <Select label='Scale method' value={scaleType} onChange={(e) => onChange(e)}>
        <Option value='linear'>Linear</Option>
        <Option value='log'>Logarithmic</Option>
      </Select>

      <Button onClick={() => {
        applyScale()
      }}>Apply Scale</Button>
    </div>
  )
}

export default LogScale
