'use client'

import boardStore from '@/shared/components/Board/board.store'
import HorizontalSlider from '@/shared/components/HorizontalSlider'
import StoreHorizontalSlider from '@/shared/components/HorizontalSlider/store'
import { newKey } from '@/shared/key'
import { PlusIcon } from 'lucide-react'
import { type JSX, MouseEvent, useCallback } from 'react'
import toast from 'react-hot-toast'

import CanvasStore from '../../store/canvas.store'
import LayerStore, { MAX_LAYERS } from '../../store/layer.store'
import BoardFrame from '../boardFrame'
import './style.scss'

const BoardFrames = (): JSX.Element => {
  const { moveToChild } = boardStore()
  const { moveToChild: horizontalMvChild } = StoreHorizontalSlider()
  const { dimensions } = CanvasStore()
  const { listOfLayers, idParentLayer, setListOfLayers, setIdParentLayer } = LayerStore()

  const handleAddNewParentLayer = useCallback(
    (e: MouseEvent) => {
      if (e.ctrlKey) return
      const id = newKey()
      const index = Object.keys(listOfLayers).length
      const newList = { ...listOfLayers }
      newList[id] = [{ id: `${id}-layer-0`, parentId: id }]
      if (Object.keys(newList).length > MAX_LAYERS) return toast.error('🔥 hay muchos canvas')

      setListOfLayers(newList)
      setIdParentLayer(id)
      moveToChild(index)
      horizontalMvChild(index)
      toast.success('🎨 Estamos listos!!')
    },
    [listOfLayers, setListOfLayers, newKey]
  )

  const width = dimensions.width * 0.1
  const height = dimensions.height * 0.1
  const clampWidth = Math.min(60, width)
  const clampHeight = Math.min(60, height)

  return (
    <HorizontalSlider parentClass='boardFrames'>
      {Object.entries(listOfLayers).map((layer, i) => {
        const [parentKey] = layer
        const isActive = idParentLayer === parentKey
        return (
          <BoardFrame
            key={parentKey}
            parentKey={parentKey}
            index={i}
            isActive={isActive}
            dimensions={{ width: clampWidth, height: clampHeight }}
          />
        )
      })}
      <button className='boardFrames-action' onClick={handleAddNewParentLayer}>
        <PlusIcon />
      </button>
    </HorizontalSlider>
  )
}

export default BoardFrames
