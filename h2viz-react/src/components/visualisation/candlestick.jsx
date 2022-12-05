import React from 'react';
import { AbstractSeries } from 'react-vis';

// See: https://github.com/uber/react-vis/blob/premodern/showcase/examples/candlestick/candlestick.js
// Base class adapted from the above source.
const predefinedClassName =
  'rv-xy-plot__series rv-xy-plot__series--candlestick';

// Candlestick class is an extension from react-vis that is used to develop Box Plot.
// See Box Plot graph for further definitions.
class CandlestickSeries extends AbstractSeries {
  render() {
    const { className, data, marginLeft, marginTop } = this.props;
    if (!data) return null

    const xFunctor = this._getAttributeFunctor('x');
    const yFunctor = this._getAttributeFunctor('y');
    const strokeFunctor =
      this._getAttributeFunctor('stroke') || this._getAttributeFunctor('color');
    const fillFunctor =
      this._getAttributeFunctor('fill') || this._getAttributeFunctor('color');

    const distance = data.length > 1 ? Math.abs(xFunctor(data[1]) - xFunctor(data[0])) * 0.05 : 25;

    return (
      <g
        className={`${predefinedClassName} ${className}`}
        transform={`translate(${marginLeft},${marginTop})`}
      >
        {data.map((d, i) => {
          const xTrans = xFunctor(d);
          // See: https://en.wikipedia.org/wiki/Candlestick_chart 
          const yHigh = yFunctor({ ...d, y: d.yHigh });     // Upper bound of stick.
          const yOpen = yFunctor({ ...d, y: d.yOpen });     // Upper bound of box.
          const yClose = yFunctor({ ...d, y: d.yClose });   // Low bound of box.
          const yLow = yFunctor({ ...d, y: d.yLow });       // Lower bound of stick.

          const lineAttrs = {
            stroke: strokeFunctor && strokeFunctor(d),
            strokeWidth: 2,
            opacity: 1
          };

          const xWidth = distance * 2;
          return (
            <g
              transform={`translate(${xTrans})`}
              opacity={1}
              key={i}
              onClick={e => this._valueClickHandler(d, e)}
              onMouseOver={e => this._valueMouseOverHandler(d, e)}
              onMouseOut={e => this._valueMouseOutHandler(d, e)}
            >
              {/* Candlestick */}
              <line
                x1={-xWidth}
                x2={xWidth}
                y1={yHigh}
                y2={yHigh}
                {...lineAttrs}
              />
              <line x1={0} x2={0} y1={yHigh} y2={yLow} {...lineAttrs} />
              <line
                x1={-xWidth}
                x2={xWidth}
                y1={yLow}
                y2={yLow}
                {...lineAttrs}
              />
              {/* Box */}
              <rect
                x={-xWidth}
                width={Math.max(xWidth * 2, 0)}
                y={yOpen}
                height={Math.abs(yOpen - yClose)}
                fill={fillFunctor && fillFunctor(d)}
              />
            </g>
          );
        })}
      </g>
    );
  }
}

CandlestickSeries.displayName = 'CandlestickSeries';

export default CandlestickSeries;
