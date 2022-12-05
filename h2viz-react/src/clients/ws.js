const subscribe = (url, subMsg, onMessage) => {

    
    // Websocket for coinbase data.
    const ws = new WebSocket(url)

    
    if (subMsg) {
        ws.onopen = () => ws.send(JSON.stringify(subMsg))
    }
    
   
    ws.onmessage = (event) => {
        onMessage(event.data)
        // ws.close()
    }
    

    ws.onclose = () => console.log("WS was closed.")
    
    return {
        stop: () => ws.close()
    }
    
}

export { subscribe }
