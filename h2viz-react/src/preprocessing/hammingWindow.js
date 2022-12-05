
// Runs the Hamming function on a value, given a window length and the actual value.
//  inputs: value (as real number), windowLength (as integer)
//  outputs: value (modified by coefficient)
const HammingWindow = (data, windowLength) => {
    // Hamming function is described as:
    //  w(n) = 0.54 * 0.46cos(2*PI*n/N)
    const val = data.value
    return 0.54 - 0.46 * (Math.cos(2 * Math.PI * val / (windowLength - 1)));
};


export default HammingWindow;
