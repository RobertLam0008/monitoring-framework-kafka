
// Runs the Hann function on a value, given a window length and the actual value.
//  inputs: value (as real number), windowLength (as integer)
//  outputs: value (modified by coefficient)
const HannWindow = (data, windowLength) => {
    // Hann function is described as:
    //  w(n) = 0.5 * (1 - cos(2*PI*n/N-1))
    const val = data.value
    return 0.5 * (1 - Math.cos(2 * Math.PI * val / (windowLength - 1)));
};


export default HannWindow;
