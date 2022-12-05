const subscribe = (onMessage) => {

    const NUM_CONNECTIONS = 8

    const mainUrl = 'http://localhost:8001'
    const urlList = []
    for (let i = 0; i < NUM_CONNECTIONS; i++) {
        urlList.push(`test${2+i}`)
    }
    var esList = []

    // Create an event source for each source added.
    for (const url of urlList) {
        // console.log("Make ES")
        const es = new EventSource(mainUrl + '/' + url)
        esList.push(es)


        es.onmessage = (event) => {
            const raw = String.fromCharCode.apply(null, JSON.parse(event.data).data)
            // console.log("ES: ", raw)
            onMessage(raw, url)
        }

        es.onerror = (e) => {
            console.log("ERROR:", e)
        }
    }

    return {
        stop: () => {
            // Close all sources.
            for (const es of esList) {
                es.close()
            }
        }
    }

}

export { subscribe }
