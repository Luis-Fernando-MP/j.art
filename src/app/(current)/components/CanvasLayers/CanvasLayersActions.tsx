import { ArrowDown, ArrowUp, PlusIcon, Trash2Icon } from 'lucide-react'
import dynamic from 'next/dynamic'
import { JSX, memo } from 'react'

import ActiveDrawsStore from '../../store/ActiveDraws.store'
import LayerStore from '../../store/layer.store'
import CopyLayer from './CopyLayer'

const MergeTool = dynamic(() => import('../MergeTool'), {
  ssr: false
})

const CanvasLayersActions = (): JSX.Element | null => {
  const { listOfLayers, setListOfLayers, addNewLayer, deleteLayer } = LayerStore()

  const { actLayerId, actParentId, setActLayerId } = ActiveDrawsStore()
  const layers = listOfLayers[actParentId]

  if (!layers) return null

  const currentIndexLayer = layers.findIndex(layer => layer.id === actLayerId)

  const handleAddLayer = () => {
    addNewLayer({ parentId: actParentId })
  }

  const moveLayerDown = () => {
    if (currentIndexLayer >= layers.length - 1 || !actLayerId) return
    const updatedLayers = structuredClone(layers)
    const temp = updatedLayers[currentIndexLayer]
    updatedLayers[currentIndexLayer] = updatedLayers[currentIndexLayer + 1]
    updatedLayers[currentIndexLayer + 1] = temp
    const newList = { ...listOfLayers, [actParentId]: updatedLayers }
    setListOfLayers(newList)
  }

  const moveLayerUp = () => {
    if (currentIndexLayer <= 0 || !actLayerId) return
    const updatedLayers = structuredClone(layers)
    const temp = updatedLayers[currentIndexLayer]
    updatedLayers[currentIndexLayer] = updatedLayers[currentIndexLayer - 1]
    updatedLayers[currentIndexLayer - 1] = temp
    const newList = { ...listOfLayers, [actParentId]: updatedLayers }
    setListOfLayers(newList)
  }

  const handleDelete = () => {
    if (!actLayerId) return
    const newSelectedLayer = deleteLayer({ actLayerId, parentId: actParentId })
    if (!newSelectedLayer) return
    setActLayerId(newSelectedLayer.id)
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
      <CopyLayer />
    </div>
  )
}

export default memo(CanvasLayersActions)
