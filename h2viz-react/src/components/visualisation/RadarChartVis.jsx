
import { CircularGridLines, RadarChart, DiscreteColorLegend } from 'react-vis'

const RadarChartVis = ({ data, domains }) => {

  if (!data) return (<div></div>)

  return (
    <div className="Chart-container" style={{ padding: 30, marginLeft: 500 }}>
      {(
        <RadarChart
          data={data}
          domains={domains}
          style={{
            polygons: {
              fillOpacity: 0.5,
              strokeWidth: 3,
              fontSize: 16,
            },
            axes: {
              text: {
                opacity: 1,
                fontSize: 20,
                fontWeight: 800,
              }
              
            },
            labels: {
              textAnchor: 'middle',
              fontSize: 20,
              fontWeight: 500,
            }
          }}
          margin={{
            left: 200,
            top: 200,
            bottom: 200,
            right: 200
          }}
          tickFormat={t => ''}
          width={800}
          height={800}
        >
          <CircularGridLines
            style={{ fontSize: '18px', fontWeight: '600' }}
            tickValues={[...new Array(10)].map((v, i) => i / 10 - 1)}
          />


        </RadarChart>
      )}
    </div>
  )
}

export default RadarChartVis
