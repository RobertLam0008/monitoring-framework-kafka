import Dexie from 'dexie'


const newCache = (name, tables, version = 1) => {
    const db = new Dexie(name)

    db.version(version).stores(tables)
    db.open()

    return db
}

const clearCache = (name) => {
    Dexie.delete(name)
}

const appendData = (tsItem, table) => {
    // Push a new entry into database with {time, value} keys.
    if (tsItem) {
        table.put({
            timestamp: new Date(tsItem.timestamp),
            value: tsItem.value
        })
    }

}

const cacheAvailable = (db) => {
    return db.isOpen()
}


const Aggregation = {
    AVERAGE: 0,
    MEDIAN: 1
}

const getFilteredData = async (db, settings) => {

    // Filter time.
    const timeStart = settings.timeStatic ? new Date(settings.windowStart) : new Date(Date.now() + settings.windowStart)
    const timeWindow = settings.timeStatic ? new Date(settings.windowLength) : new Date(Date.now() + settings.windowLength)

    let seriesDataMap = {}

    for (const sourceObj of settings.sourceIDList) {
        const source = sourceObj.name
        try {
            // If the user leaves the page, the database will close, so exit the function.
            const seriesData = await db.tables.filter((t) => t.name === source)[0]
                .where('timestamp').between(timeStart, timeWindow)
                .toArray()
                .catch(e => {
                    // Failed to retrieve data (user might have left page).
                    return null
                })

            if (seriesData.length === 0) {
                // If array is empty, skip.
                continue
            }

            // Apply smoothing window.
            if (settings.smoothMethod != null) {
                seriesDataMap[source] = seriesData.map((d) => {
                    return {
                        timestamp: d.timestamp,
                        value: settings.smoothMethod(d, settings.smoothParameter, seriesData)
                    }
                })
            }
            else {
                seriesDataMap[source] = seriesData
            }
        } catch (e) {
            // Failed to update data (user might have left page during update)
            return null
        }
    }

    return seriesDataMap
}

const prepareSingleSeries = (ts, ms, aggregation) => {
    ms = ms || 1000
    aggregation = aggregation || 0

    const tsGrouped = ts.reduce((r, i) => {
        const group = Math.floor(i.timestamp / ms) * ms
        r[group] = r[group] || []
        r[group].push(i.value)
        return r
    }, {})

    const result = Object.keys(tsGrouped).map((timestampStr) => {
        const values = tsGrouped[timestampStr]
        let value = 0
        if (aggregation === Aggregation.AVERAGE) {
            value = values.reduce((x, y) => x + y, 0) / values.length
        }
        if (aggregation === Aggregation.MEDIAN) {
            const sorted = values.sort()
            if (values.length % 2 === 0) {
                const i = values.length / 2
                value = (sorted[i] + sorted[i + 1]) / 2
            } else {
                const i = (values.length + 1) / 2
                value = sorted[i]
            }
        }
        return { timestamp: Number.parseInt(timestampStr), value }
    })

    return result
}

export { prepareSingleSeries, appendData, newCache, clearCache, cacheAvailable, getFilteredData, Aggregation }
