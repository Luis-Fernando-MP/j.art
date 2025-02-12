import { ArrowDown, ArrowUp, CopyIcon, PlusIcon, Trash2Icon } from 'lucide-react'
import dynamic from 'next/dynamic'
import { JSX, memo } from 'react'

import LayerStore from '../../store/layer.store'
import MergeTool from '../MergeTool'

// const MergeTool = dynamic(() => import('../MergeTool'), {
//   ssr: false
// })

const CanvasLayersActions = (): JSX.Element | null => {
  const { listOfLayers, idParentLayer, setListOfLayers, activeLayer, addLayer, deleteLayer } = LayerStore()
  const layers = listOfLayers[idParentLayer.id]
  if (!layers) return null

  const currentIndexLayer = layers.findIndex(layer => layer.id === activeLayer.id)

  const handleAddLayer = () => {
    addLayer({ parentId: idParentLayer.id })
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

  const handleDelete = (): void => {
    deleteLayer(activeLayer)
  }

  return (
    <div className='canvasLayers-actions'>
      <button onClick={handleAddLayer}>
        <PlusIcon />
      </button>
      <button onClick={() => moveLayerDown()}>
        <ArrowDown />
      </button>
      <button onClick={() => moveLayerUp()}>
        <ArrowUp />
      </button>
      <MergeTool />
      <button onClick={handleDelete}>
        <Trash2Icon />
      </button>
      <button>
        <CopyIcon />
      </button>
    </div>
  )
}

export default memo(CanvasLayersActions)
