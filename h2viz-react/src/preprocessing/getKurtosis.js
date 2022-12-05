
// Gets excess kurtosis of data set
//  inputs: array of values
//  outputs: kurtosis of values

import getMean from './getMean'
import getVariance from './getVariance'

const getKurtosis = (data) => {
    if (data.length === 0) return

    const mean = getMean(data)
    const variance = getVariance(data)

    // Get fourth moment of data set.
    const fourth = data.map((d) => (d - mean) ** 4)
        .reduce((total, elem) => total + elem) / data.length

    // Get excess kurtosis.
    const output = fourth / (variance ** 2) - 3

    return output;
};


export default getKurtosis;
