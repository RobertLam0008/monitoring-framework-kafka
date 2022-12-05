
import { FlexibleWidthXYPlot, XAxis, YAxis, HorizontalGridLines, VerticalGridLines, VerticalBarSeries, DiscreteColorLegend } from 'react-vis'

const MultiBarChart = ({ data, range, legend }) => {

  if (!data) return (<div></div>)

  return (
    <div className="Chart-container">
      {(
        <FlexibleWidthXYPlot yDomain={range} height={400} margin={{ left: 200, right: 400, bottom: 200 }} xType="time">
          <HorizontalGridLines />
          <VerticalGridLines />
          <XAxis title="Time" style={{fontSize: '22px', fontWeight: '600', zIndex: 200}}/>
          <YAxis title="Value" style={{fontSize: '22px', fontWeight: '600', zIndex: 200}}/>
          {
            Object.keys(data).map((source) => {
              return <VerticalBarSeries key={`series-${source}`} data={data[source]} stroke={"white"} style={{zIndex: -200}}/>
            })
          }
        </FlexibleWidthXYPlot>
      )}
      {(
        <DiscreteColorLegend items={legend} orientation={"horizontal"}/>
      )}
    </div>
  )
}

export default MultiBarChart
