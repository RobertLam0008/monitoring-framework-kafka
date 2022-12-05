
// Gets variance of data set (sum of all values divided by number of elements)
//  inputs: array of values
//  outputs: variance of values

import getMean from './getMean'

const getVariance = (data) => {
    if (data.length === 0) return

    const mean = getMean(data)

    // Get squared difference.
    const output = data.map((d) => (d - mean) ** 2)
        .reduce((total, elem) => total + elem) / data.length

    return output;
};


export default getVariance;
