import { useState, useEffect, useContext } from 'react'
import Button from '@material/react-button'
import CloseIcon from '@material-ui/icons/Close';
import TextField, { Input } from '@material/react-text-field'


const SourcesManager = ({ contextSettings }) => {
  const settings = useContext(contextSettings)
  const [sourceID, setSourceID] = useState('')  // For the text box.
  const [sourcesObjects, setSourcesObjects] = useState([])

  const leftColor = "#0D939A"
  const rightColor = "#FFAA80"

  useEffect(() => {
    // On mount, update default values.
    setSourcesObjects(settings.sourceIDList)
  }, [])

  const addSource = (sourceID) => {
    // Get list of source IDs.
    let newSources = settings.sourceIDList
    const sourceObj = {
      name: sourceID,
      isLeft: true,
      color: "#0D939A"
    }

    if (!settings.sourceIDList.map((d) => d.name).includes(sourceID)) {
      newSources = [...settings.sourceIDList, sourceObj]
    }

    updateSource(newSources)
  }

  const removeSource = (sourceID) => {
    // Get list of source IDs.
    let newSources = settings.sourceIDList
    if (settings.sourceIDList.map((d) => d.name).includes(sourceID)) {
      let removedList = settings.sourceIDList
      removedList.splice(settings.sourceIDList.map((d) => d.name).indexOf(sourceID), 1)
      newSources = removedList
    }

    updateSource(newSources)
  }

  const updateSource = (newSources) => {
    // Create table object.
    let tables = {}
    newSources.forEach((sourceID) => {
      tables[sourceID.name] = 'timestamp'
    })

    settings.callbackApplyParams()

    settings.callbackSourceTables(tables)
    settings.callbackSourceIDList(newSources)
    settings.callbackVersion(settings.version + 1)
    setSourcesObjects(newSources)
  }

  const swapGroup = (i) => {
    const left = settings.sourceIDList[i].isLeft
    settings.sourceIDList[i].isLeft = !left
    settings.sourceIDList[i].color = !left ? leftColor : rightColor
  }

  const listTemplate = (data) => {
    return (
      <div style={{ fontFamily: "sans-serif", color: "#484848" }}>

        {data.text}
        <Button onClick={() => removeSource(data.text)} icon={<CloseIcon></CloseIcon>}></Button>
        <Button onClick={() => swapGroup(data.i)}>Grouped {settings.sourceIDList[data.i].isLeft ? "Left" : "Right"}</Button>
        <div style={{ backgroundColor: data.color, marginLeft: "20px", marginBottom: "-8px", width: "25px", height: "25px", display: "inline-block" }}></div>

      </div>
    )
  }

  return (
    <div style={{ right: "3%", top: "5%", position: "absolute", zIndex: "100" }}>

      <div>
        <TextField label='Data source ID'>
          <Input value={sourceID} onChange={(e) => setSourceID(e.currentTarget.value)}></Input>
        </TextField>
        <Button onClick={e => addSource(sourceID)}>Add Source</Button>
      </div>
      <div>
        {sourcesObjects.map((d, i) => {
          return listTemplate({
            text: d.name,
            i: i,
            color: d.color
          })
        })}
      </div>

    </div>
  )
}

export default SourcesManager
