import { subscribe as sub } from './ws.js'

const url = "wss://ws-feed.pro.coinbase.com"

const subscribe = (productId, channel, onMessage) => {

    const subMsg = {
        "type": "subscribe",
        "product_ids": Array.isArray(productId) ? productId : [productId], // ["ETH-USD", "BTC-USD"]
        "channels": Array.isArray(channel) ? channel : [channel], //["matches"]
    }

    // Return subscription function that listens for message in the specified format.
    return sub(url, subMsg, (msg) => {

        const dataObj = JSON.parse(msg)
        if (dataObj.price && dataObj.time) {
            onMessage({
                timestamp: Date.parse(dataObj.time),
                value: Number.parseFloat(dataObj.price),
                measurement: dataObj.product_id,
            })
        }

    })
}

export { subscribe }
