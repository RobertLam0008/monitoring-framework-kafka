
const mapToDomain = (data, currentDomain, newDomain) => {
  // Given a data object and the domain it comes from, map it to another domain.

  const newData = data.map((d) => {
    return {
      timestamp: d.timestamp,
      value: ((d.value - currentDomain[0]) / (currentDomain[1] - currentDomain[0])) * newDomain[1]
    }
  })

  return newData
}

export { mapToDomain }
