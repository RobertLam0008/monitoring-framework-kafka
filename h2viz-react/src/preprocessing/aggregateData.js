
// Reduces the array to a smaller subset, where each data is
// an average of data gathered in a specified timeframe.
//  inputs: data (array), time (in seconds)
//  outputs: the new array

// This can be made more efficient by taking advantage of reduce, but for now it
// uses a naive and wasteful approach.
const WindowData = (data, time) => {
    // Base case check.
    if (!(data.length > 0)) return data;

    // Lists to push data into.
    var finalList = [];
    var subList = [];
    var timeAcc = data[0].time;
    const ms = time * 1000;
    finalList.push(data[0]);

    // Window data.
    data.reduce((acc, val, i) => {
        if (val.time < timeAcc + ms) {
            subList.push(val.value);
        }

        if (val.time >= timeAcc + ms || i === data.length - 1) {
            var len = subList.length;
            var avg = subList.reduce((a, b) => a + b);
            avg /= len;
            finalList.push({
                time: timeAcc,
                value: avg
            });
            subList = []
            timeAcc += ms;
        }

        return acc;
    });

    // Return output.
    return finalList;
};


export default WindowData;
