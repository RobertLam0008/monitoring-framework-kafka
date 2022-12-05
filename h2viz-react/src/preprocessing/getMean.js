
// Gets average of data set (sum of all values divided by number of elements)
//  inputs: array of values
//  outputs: mean of values

const getMean = (data) => {
    if (data.length === 0) return

    const output = data.reduce((total, elem) => total + elem) / data.length

    return output
};


export default getMean;
