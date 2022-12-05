import { useContext } from 'react'
import { FlexibleWidthXYPlot, XAxis, YAxis, HorizontalGridLines, VerticalGridLines, LineSeries, DiscreteColorLegend } from 'react-vis'
import { mapToDomain } from '../../preprocessing/mapToDomain'

const LineChart = ({ data, contextSettings }) => {
  const settings = useContext(contextSettings)

  if (!data) return (<div></div>)

  // Split up data to use either the left axis or the right axis.
  // In future, allow additional axes to be padded to each side to support more than two groups.
  let leftDomain = [null, null]
  let rightDomain = [null, null]
  for (const source in settings.sourceIDList) {
    const src = settings.sourceIDList[source]

    if (!data[src.name]) continue
    const vals = data[src.name].map((d) => d.value)
    const thisMin = Math.min(...vals)
    const thisMax = Math.max(...vals)

    if (src.isLeft) {
      if (thisMin < leftDomain[0] || leftDomain[0] === null) leftDomain[0] = thisMin
      if (thisMax > leftDomain[1] || leftDomain[1] === null) leftDomain[1] = thisMax
    }
    else {
      if (thisMin < rightDomain[0] || rightDomain[0] === null) rightDomain[0] = thisMin
      if (thisMax > rightDomain[1] || rightDomain[0] === null) rightDomain[1] = thisMax
    }
  }

  return (
    <div className="Chart-container" style={{ padding: 30 }}>
      {(
        <FlexibleWidthXYPlot yDomain={settings.range} height={500} margin={{ left: 200, right: 400, bottom: 200 }} xType="time" getX={d => d.timestamp} getY={d => d.value}>
          <HorizontalGridLines />
          <VerticalGridLines />
          {
            settings.sourceIDList.map((inputSource) => {
              const source = inputSource.name
              return <LineSeries key={`series-${source}`} data={inputSource.isLeft ? data[source] : mapToDomain(data[source], rightDomain, leftDomain)} yType={settings.scaleType}
                color={inputSource.color} />
            })
          }
          <XAxis title="Time" style={{fontSize: '24px', fontWeight: '600'}}/>
          <YAxis title="Value" orientation="left" style={{fontSize: '24px', fontWeight: '600'}} />
          <YAxis title="Value" orientation="right" yDomain={rightDomain} style={{fontSize: '24px', fontWeight: '600'}}/>
        </FlexibleWidthXYPlot>
      )}
      {(
        <DiscreteColorLegend style={{fontSize: '24px', fontWeight: '600'}} items={Object.keys(data)} orientation={"horizontal"}/>
      )}
    </div>
  )
}

export default LineChart
