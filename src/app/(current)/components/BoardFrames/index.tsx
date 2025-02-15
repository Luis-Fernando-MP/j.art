'use client'

import boardStore from '@/shared/components/Board/board.store'
import HorizontalSlider from '@/shared/components/HorizontalSlider'
import StoreHorizontalSlider from '@/shared/components/HorizontalSlider/store'
import { PlusIcon } from 'lucide-react'
import { type JSX, MouseEvent, useCallback } from 'react'
import toast from 'react-hot-toast'

import ActiveDrawsStore from '../../store/ActiveDraws.store'
import LayerStore from '../../store/layer.store'
import RepaintDrawingStore from '../../store/repaintDrawing.store'
import ListBoardFrames from './ListBoardFrames'
import './style.scss'

const BoardFrames = (): JSX.Element => {
  const { moveToChild } = boardStore()
  const { moveToChild: horizontalMvChild } = StoreHorizontalSlider()
  const { setListOfLayers, addNewFrame } = LayerStore()

  const { setActParentId, setActParentIndex, setActLayerId } = ActiveDrawsStore()

  const { cleanViewerFrame } = RepaintDrawingStore()

  const handleAddNewParentLayer = useCallback(
    (e: MouseEvent) => {
      if (e.ctrlKey) return
      const frame = addNewFrame()
      if (!frame) return
      const { frameKey, index, layerId } = frame

      setActParentId(frameKey)
      setActParentIndex(index)
      setActLayerId(layerId)

      cleanViewerFrame()

      moveToChild(index)
      horizontalMvChild(index)
      toast.success('🎨 Estamos listos!!')
    },
    [setListOfLayers, horizontalMvChild, moveToChild, setActParentId, setActParentIndex, setActLayerId]
  )

  return (
    <HorizontalSlider parentClass='boardFrames' className='boardFrames-list'>
      <ListBoardFrames />

      <button className='boardFrames-action' onClick={handleAddNewParentLayer}>
        <PlusIcon />
      </button>
    </HorizontalSlider>
  )
}

export default BoardFrames
