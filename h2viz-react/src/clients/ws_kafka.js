const subscribe = (onMessage) => {

    // Websocket for Kafka data.

    let server = 'ws://localhost:8001/'

    // Params (currently hardcoded)
    const topic = 'test2'
    const consumer = 'test-group'

    const options = null    // Use null for now
    const ws = new WebSocket(server + `?topic=${topic}&consumerGroup=${consumer}`, options)

    // Temp, for each server/topic we'll need to contain them in an array.
    // For now let's just check we can get two servers up at the same time.
    const _ws2 = new WebSocket(server + `?topic=test3&consumerGroup=${consumer}`, options)

    ws.onopen = () => {
        // console.log('Opened server for topic.')
    }

    ws.onmessage = (data) => {
        // console.log(`Event:`, data)
        console.log("ONMESSAGE:", Date.now())
        onMessage(data, 'test2')
    }

    _ws2.onmessage = (data) => {
        // console.log(`_Event:`, data)
        onMessage(data, 'test3')
    }

    // ws.onclose = () => console.log("WS was closed.")

    return {
        stop: () => {
            ws.close()
            _ws2.close()
        }
    }

}

export { subscribe }
