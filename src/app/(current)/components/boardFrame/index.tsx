'use client'

import { acl } from '@/shared/acl'
import boardStore from '@/shared/components/Board/board.store'
import StoreHorizontalSlider from '@/shared/components/HorizontalSlider/store'
import { BLANK_IMAGE } from '@/shared/constants'
import { Image } from '@unpic/react'
import { XIcon } from 'lucide-react'
import dynamic from 'next/dynamic'
import { type JSX, MouseEvent, memo } from 'react'
import toast from 'react-hot-toast'

import ActiveDrawsStore from '../../store/ActiveDraws.store'
import LayerStore from '../../store/layer.store'
import RepaintDrawingStore from '../../store/repaintDrawing.store'
import './style.scss'

interface IBoardFrame {
  isActive: boolean
  index: number
  parentKey: string
  firstLayer: string
}

export interface ISelectAndMoveFrame {
  parentIndex: number
  frameId: string
  layerId: string
}

const CloneFrame = dynamic(() => import('./CloneFrame'), {
  ssr: false
})

const BoardFrame = ({ isActive, index, parentKey, firstLayer }: IBoardFrame): JSX.Element => {
  const { moveToChild } = boardStore()
  const { listOfLayers, setListOfLayers } = LayerStore()
  const { setActLayerId, setActParentIndex, setActParentId } = ActiveDrawsStore()
  const { setRepaint } = RepaintDrawingStore()
  const { moveToChild: horizontalMvChild } = StoreHorizontalSlider()

  const handleSelectFrame = (e: MouseEvent): void => {
    if (e.ctrlKey) return
    selectAndMoveFrame({ parentIndex: index, frameId: parentKey, layerId: firstLayer })
    setRepaint('frames')
  }

  const selectAndMoveFrame = ({ frameId, layerId, parentIndex }: ISelectAndMoveFrame) => {
    moveToChild(parentIndex)
    horizontalMvChild(parentIndex)
    setActParentId(frameId)
    setActParentIndex(parentIndex)
    setActLayerId(layerId)
  }

  const handleRemoveLayer = (e: MouseEvent): void => {
    if (e.ctrlKey) return
    const cloneLayers = structuredClone(listOfLayers)
    toast.success('❌ Bye!! Bye!!')
    delete cloneLayers[parentKey]
    setListOfLayers(cloneLayers)
  }

  return (
    <div className={`boardFrame ${acl(isActive, 'selected')}`}>
      <button className='boardFrame-button' onClick={handleSelectFrame}>
        <Image src={BLANK_IMAGE} alt='canvas-frame' layout='fullWidth' id={`${parentKey}-frame-view`} />
      </button>
      <div className='boardFrame-controls'>
        <button className='boardFrame-control' onClick={handleRemoveLayer}>
          <XIcon />
        </button>
        <CloneFrame parentKey={parentKey} onClone={selectAndMoveFrame} />
      </div>
    </div>
  )
}

export default memo(BoardFrame)
