'use client'

import { acl } from '@/shared/acl'
import boardStore from '@/shared/components/Board/board.store'
import StoreHorizontalSlider from '@/shared/components/HorizontalSlider/store'
import { newKey } from '@/shared/key'
import { Layers2Icon, XIcon } from 'lucide-react'
import { type JSX, MouseEvent, memo } from 'react'
import toast from 'react-hot-toast'

import LayerStore, { MAX_LAYERS } from '../../store/layer.store'
import './style.scss'

interface IBoardFrame {
  isActive: boolean
  index: number
  parentKey: string
  dimensions: {
    width: number
    height: number
  }
}

const BoardFrame = ({ isActive, index, parentKey, dimensions }: IBoardFrame): JSX.Element => {
  const { moveToChild } = boardStore()
  const { setIdParentLayer, listOfLayers, setListOfLayers } = LayerStore()
  const { moveToChild: horizontalMvChild } = StoreHorizontalSlider()

  const handleClick = (e: MouseEvent): void => {
    if (e.ctrlKey) return
    moveToChild(index)
    horizontalMvChild(index)
    if (isActive) return
    setIdParentLayer({ id: parentKey, index })
  }

  const handleRemoveLayer = (e: MouseEvent): void => {
    if (e.ctrlKey) return
    const cloneLayers = structuredClone(listOfLayers)
    toast.success('👋 OK')
    delete cloneLayers[parentKey]
    setListOfLayers(cloneLayers)
  }

  const handleCloneLayer = (e: MouseEvent) => {
    if (e.ctrlKey) return
    const cloneLayers = structuredClone(listOfLayers)
    const currentLayer = cloneLayers[parentKey]
    if (!currentLayer) return toast.error('❗️ Este canvas no existe')
    const entries = Object.entries(cloneLayers)
    const layerIndex = entries.findIndex(([key]) => key === parentKey)
    if (layerIndex === -1) return toast.error('❗️ Este canvas no existe')
    if (entries.length >= MAX_LAYERS) return toast.error('🔥 hay muchos canvas')
    const key = newKey()
    const newEntries = [...entries.slice(0, layerIndex + 1), [key, currentLayer], ...entries.slice(layerIndex + 1)]
    setListOfLayers(Object.fromEntries(newEntries))
    toast.success('👁️ Clonado')
  }

  return (
    <div className={`boardFrame ${acl(isActive)}`}>
      <button className='boardFrame-button' onClick={handleClick}>
        <canvas id={`${parentKey}-frame`} width={dimensions.width} height={dimensions.height} />
      </button>
      <div className='boardFrame-controls'>
        <button className='boardFrame-control' onClick={handleRemoveLayer}>
          <XIcon />
        </button>
        <button className='boardFrame-control' onClick={handleCloneLayer}>
          <Layers2Icon />
        </button>
      </div>
    </div>
  )
}

export default memo(BoardFrame)
