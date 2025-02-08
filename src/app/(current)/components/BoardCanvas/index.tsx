import Board from '@/shared/components/Board'
import boardStore from '@/shared/components/Board/board.store'
import StoreHorizontalSlider from '@/shared/components/HorizontalSlider/store'
import { newKey } from '@/shared/key'
import { PlusIcon } from 'lucide-react'
import { type JSX, MouseEvent, useCallback } from 'react'
import toast from 'react-hot-toast'

import CanvasStore from '../../store/canvas.store'
import LayerStore, { MAX_LAYERS } from '../../store/layer.store'
import Layers from '../Layers'
import './style.scss'

const BoardCanvas = (): JSX.Element => {
  const { moveToChild } = boardStore()
  const { moveToChild: horizontalMvChild } = StoreHorizontalSlider()
  const { dimensions } = CanvasStore()
  const { listOfLayers, idParentLayer, setListOfLayers, setIdParentLayer } = LayerStore()

  const handleAddNewParentLayer = useCallback(
    (e: MouseEvent) => {
      if (e.ctrlKey) return
      const id = newKey()
      const newList = { ...listOfLayers }
      const index = Object.keys(listOfLayers).length
      newList[id] = [{ id: `${id}-layer-0`, parentId: id }]
      if (Object.keys(newList).length > MAX_LAYERS) return toast.error('🔥 hay muchos canvas')
      setListOfLayers(newList)
      setIdParentLayer({
        id,
        index
      })
      moveToChild(index)
      horizontalMvChild(index)
      toast.success('🎨 Estamos listos!!')
    },
    [listOfLayers, setListOfLayers, newKey]
  )

  return (
    <Board className='canvasBoard' isCenter={false}>
      {() => {
        return (
          <>
            {Object.entries(listOfLayers).map((layer, index) => {
              const [parentId, layers] = layer
              return (
                <Layers
                  key={parentId}
                  layers={layers}
                  isDisable={idParentLayer.id !== parentId}
                  parentId={parentId}
                  index={index}
                />
              )
            })}
            <button
              className='canvasBoard-addFrame'
              onClick={handleAddNewParentLayer}
              style={{
                width: dimensions.width,
                height: dimensions.height
              }}
            >
              <PlusIcon />
            </button>
          </>
        )
      }}
    </Board>
  )
}

export default BoardCanvas
