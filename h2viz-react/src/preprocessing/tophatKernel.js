
// Runs the Tophat Kernel function on a value, given a bandwidth size and the actual value.
//  inputs: value (as real number), dataset (as array), bandwidth (as float in seconds)
//  outputs: value (modified by coefficient)
const TophatKernel = (current, bandwidth, data) => {
    // Tophat kernel function is described as:
    //  K(x;h) = 1/2h for |x| < h
    // We smooth the value out by averaging it with values following this rule.

    if (!current.timestamp) return current
    if (!data) return current.value
    if (!data.length) return current.value

    const ms = bandwidth * 1000
    const currentTime = current.timestamp.getTime()

    const filteredData = data
        .filter(
            (d) => d.timestamp.getTime() > currentTime - ms && d.timestamp.getTime() < currentTime + ms
        )

    const averageVal = filteredData
        .map((d) => d.value)
        .reduce(
            (acc, d) => (acc + d)
        ) / filteredData.length

    if (averageVal) {
        return averageVal
    }

    return current.value
};


export default TophatKernel;
