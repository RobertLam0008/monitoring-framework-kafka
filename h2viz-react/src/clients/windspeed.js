import { subscribe as sub } from './eventSource'

const url = "https://h2c-test-xllct7nrta-km.a.run.app/events"

const subscribe = (productId, channel, onMessage) => {

    const subMsg = {
        "type": "subscribe",
        "product_ids": Array.isArray(productId) ? productId : [productId], // ["ETH-USD", "BTC-USD"]
        "channels": Array.isArray(channel) ? channel : [channel], //["matches"]
    }

    // Return subscription function that listens for message in the specified format.
    return sub(url, subMsg, (msg) => {

        const dataObj = JSON.parse(msg)
        if (dataObj.timestamp && dataObj.topic && dataObj.data) {
            onMessage({
                timestamp: Date.parse(dataObj.timestamp),
                value: Number.parseFloat(dataObj.data.value),
                measurement: dataObj.topic
            })
        }

    })
}

export { subscribe }
