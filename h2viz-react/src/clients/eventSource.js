const subscribe = (url, subMsg, onMessage) => {

    var urlList = []
    if (subMsg.product_ids) {
        for (const id of subMsg.product_ids) {
            // Create an event source for each source added.
            const es = new EventSource(url + '/' + id)
            urlList.push(es)

            es.onmessage = (event) => {
                onMessage(event.data)
            }

        }
    }

    return {
        stop: () => {
            // Close all sources.
            for (const es of urlList) {
                es.close()
            }
        }
    }
    
}

export { subscribe }
