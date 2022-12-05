import React from 'react';
import { useState } from 'react';
import { XAxis, YAxis, FlexibleWidthXYPlot, MarkSeries, Hint, DiscreteColorLegend } from 'react-vis';
import Candlestick from './candlestick';

const BoxPlot = ({ data, range }) => {

  // Constant props.
  const mainColour = "#0D939A"
  const lineColour = "#37B3B9"
  const xOffsets = "80px"

  // States for hover tooltips.
  const [hoverProps, setHoverProps] = useState(null)
  const [outlierHoverProps, setOutlierHoverProps] = useState(null)

  const tipStyle = {
    display: 'flex',
    color: '#fff',
    opacity: '0.8',
    background: '#000',
    padding: '5px'
  };

  // Ensure we only have valid data.
  data = data.filter((d) => d.y !== undefined)
  if (!data) return null
  if (data.length < 1) return null

  return (
    <div className="Chart-container" style={{ paddingLeft: xOffsets, paddingRight: xOffsets, marginLeft: 100, marginRight: 400, marginBottom: 200 }}>
      <FlexibleWidthXYPlot animation yDomain={range} xDomain={[0, data.length + 1]} height={300}>
        <XAxis style={{ fontSize: '18px', fontWeight: '600' }} tickFormat={(v, i, s, t) => data[v - 1] ? data[v - 1].name : ''} />
        <YAxis style={{ fontSize: '18px', fontWeight: '600' }} />
        {
          data.map((d, i) => {
            return <MarkSeries color={mainColour} size={2} opacity={1} animation={false}
              data={d.outliers == null ? [] : d.outliers.map((v) => {
                return {
                  x: i + 1,
                  y: v
                }
              })}
              onValueMouseOver={(v) => setOutlierHoverProps(v.x && v.y ? v : false)}
              onValueMouseOut={() => setOutlierHoverProps(false)}
            />
          })
        }

        <Candlestick
          color={mainColour}
          stroke={lineColour}
          data={data}
          onValueMouseOver={(v) => setHoverProps(v.x && v.y ? v : false)}
          onValueMouseOut={() => setHoverProps(false)}
        />
        {hoverProps &&
          <Hint value={{ x: hoverProps.x, y: hoverProps.y }}>
            <div style={tipStyle}>
              Median: {hoverProps.y} <br />
              Inner: {Math.min(hoverProps.yClose, hoverProps.yOpen)}, {Math.max(hoverProps.yClose, hoverProps.yOpen)} <br />
              Outer: {Math.min(hoverProps.yLow, hoverProps.yHigh)}, {Math.max(hoverProps.yLow, hoverProps.yHigh)}
            </div>
          </Hint>}
        {outlierHoverProps &&
          <Hint value={{ x: outlierHoverProps.x, y: outlierHoverProps.y }}>
            <div style={tipStyle}>
              Outlier: {outlierHoverProps.y}
            </div>
          </Hint>}
      </FlexibleWidthXYPlot>
    </div>
  );
}

export default BoxPlot;
