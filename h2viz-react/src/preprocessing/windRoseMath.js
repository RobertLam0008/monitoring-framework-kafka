
const splitInterval = (val, interval, num) => {
  // Split a value into specific intervals
  // Used primarily for wind rose chart to format data into appropriate sections.
  var vals = []
  for (var i = 0; i < num; i++) {
    vals.push(Math.max(0, Math.min(val, interval)))
    val -= interval
  }

  return vals
}

const splitAngle = (val, num) => {
  const interval = 360 / num
  var idx = 0
  while (val > interval) {
    idx += 1
    val -= interval
  }

  return idx
}

const arrayAverage = (arr) => {
  if (!arr) return 0
  if (arr.length === 0) return 0

  const sum = arr.reduce((a, b) => a + b, 0)
  const avg = sum / arr.length

  return avg
}


export { splitInterval, splitAngle, arrayAverage };
