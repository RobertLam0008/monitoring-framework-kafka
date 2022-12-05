
import { FlexibleWidthXYPlot, XAxis, YAxis, HorizontalGridLines, LineSeries, DiscreteColorLegend } from 'react-vis'

const FFTMultiLineChart = ({ data, range, legend }) => {

  if (!data) return (<div></div>)
  if (data === undefined) return (<div></div>)

  // Format data for when we check if we have too many axis ticks.
  const vals = Object.keys(data).map((source) => data[source])
  const joinedVals = [].concat(...vals)

  return (
    <div className="Chart-container">
      {(
        <FlexibleWidthXYPlot yDomain={range} height={400} margin={{ left: 200, right: 400, bottom: 200 }} xType="ordinal" getX={d => d.frequency} getY={d => d.amplitude}>
          <HorizontalGridLines />
          {
            Object.keys(data).map((source) => {
              return <LineSeries key={`series-${source}`} data={data[source]} />
            })
          }
          <XAxis title="Frequency (Hz)" style={{fontSize: '14px', fontWeight: '600'}} tickLabelAngle={-90} tickFormat={d => `${Number.parseFloat(d).toFixed(5)}`} tickValues={
            // Limit axis ticks if they exceed 20, so we don't clutter the graph.
            (joinedVals.length > 20) ?
            joinedVals
                .filter((d, index) => {
                  if ((index % Math.floor(joinedVals.length / 20)) === 0) return d.frequency
                  return null
                })
                .map(d => d.frequency)
              : joinedVals.map(d => d.frequency)
          } />
          <YAxis title="Amplitude" style={{fontSize: '18px', fontWeight: '600'}}/>
        </FlexibleWidthXYPlot>
      )}
      {(
        <DiscreteColorLegend items={legend} orientation={"horizontal"}/>
      )}
    </div>
  )
}

export default FFTMultiLineChart
