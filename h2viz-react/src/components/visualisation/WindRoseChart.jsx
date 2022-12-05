import { PolarChart, CommonSeriesSettings, Series, ArgumentAxis, ValueAxis, Margin } from 'devextreme-react/polar-chart'

const WindRoseChart = ({ data, columns }) => {

  if (!data) return (<div></div>)

  return (

    <div className="Chart-container">
      {(
        <PolarChart
          id="radarChart"
          palette="Soft"
          dataSource={data}
          title={"Windrose Chart"}
          width={1400}
          height={800}
          style={{
            fontSize: 24,
            fontWeight: 600,
          }}
          size={{ height: 800, width: 1700 }}
          barGroupPadding={0}
        >
          <CommonSeriesSettings type="stackedbar" />
          {
            columns.map(function (item) {
              return <Series key={item.value} valueField={item.value} name={item.name} />;
            })
          }
          <Margin
            bottom={50}
            left={100}
          />
          <ArgumentAxis
            discreteAxisDivisionMode="crossLabels"
            firstPointOnStartAngle={true}
            label={{
              font: {
                size: 24,
                weight: 600
              }
            }}
          />
          <ValueAxis
            valueMarginsEnabled={false}
            tickInterval={2}
            visualRange={[0, 8]}
            label={{
              font: {
                size: 16,
                weight: 600
              }
            }}
          />
        </PolarChart>
      )}
    </div>
  )
}

export default WindRoseChart
