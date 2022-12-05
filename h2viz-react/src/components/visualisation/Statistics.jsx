
import getKurtosis from '../../preprocessing/getKurtosis'
import getMean from '../../preprocessing/getMean'
import getVariance from '../../preprocessing/getVariance'

const Statistics = ({ dataValues }) => {

  const stats = {
    mean: getMean(dataValues),
    variance: getVariance(dataValues),
    kurtosis: getKurtosis(dataValues)
  }

  return (
    <div className="Statistics">
      <p>Mean: {stats.mean}</p>
      <p>Variance: {stats.variance}</p>
      <p>Excess Kurtosis: {stats.kurtosis}</p>
    </div>
  )
}

export default Statistics
