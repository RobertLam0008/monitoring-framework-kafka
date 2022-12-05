import * as tf from '@tensorflow/tfjs'

const rfft = (values, samplingRate) => {
    const n = values.length
    const ampl_values = tf.tensor1d(values).rfft().abs().div(n).arraySync()

    const result = ampl_values.map((v, i) => {
        return {
            amplitude: v,
            frequency: i * samplingRate / n,
        }
    })

    return result
}

export { rfft }
