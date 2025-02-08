import { onion } from '@lucide/lab'
import { ArrowDown, ArrowUp, CombineIcon, Icon, PlusIcon } from 'lucide-react'
import { JSX, memo, useMemo } from 'react'

import LayerStore from '../../store/layer.store'

const CanvasLayersActions = (): JSX.Element => {
  const { listOfLayers, idParentLayer, setListOfLayers, activeLayer } = LayerStore()
  const layers = listOfLayers[idParentLayer.id]

  const currentIndexLayer = layers.findIndex(layer => layer.id === activeLayer)

  const addLayer = () => {
    const newLayerId = `${idParentLayer.id}-layer${layers.length + 1}`
    const newLayer = {
      id: newLayerId,
      title: `capa ${layers.length + 1}`,
      parentId: idParentLayer.id,
      imageUrl: null,
      isActive: false
    }
    const updatedLayers = [...layers, newLayer]
    setListOfLayers({ ...listOfLayers, [idParentLayer.id]: updatedLayers })
  }

  const moveLayerDown = () => {
    if (currentIndexLayer >= layers.length - 1) return
    const updatedLayers = structuredClone(layers)
    const temp = updatedLayers[currentIndexLayer]
    updatedLayers[currentIndexLayer] = updatedLayers[currentIndexLayer + 1]
    updatedLayers[currentIndexLayer + 1] = temp
    const newList = { ...listOfLayers, [idParentLayer.id]: updatedLayers }
    setListOfLayers(newList)
  }

  const moveLayerUp = () => {
    if (currentIndexLayer <= 0) return
    const updatedLayers = structuredClone(layers)
    const temp = updatedLayers[currentIndexLayer]
    updatedLayers[currentIndexLayer] = updatedLayers[currentIndexLayer - 1]
    updatedLayers[currentIndexLayer - 1] = temp
    const newList = { ...listOfLayers, [idParentLayer.id]: updatedLayers }
    setListOfLayers(newList)
  }

  return (
    <div className='canvasLayers-actions'>
      <button onClick={addLayer}>
        <PlusIcon />
      </button>
      <button onClick={() => moveLayerDown()}>
        <ArrowDown />
      </button>
      <button onClick={() => moveLayerUp()}>
        <ArrowUp />
      </button>
      <button>
        <CombineIcon />
      </button>
      <button>
        <Icon iconNode={onion} />
      </button>
    </div>
  )
}

export default memo(CanvasLayersActions)
