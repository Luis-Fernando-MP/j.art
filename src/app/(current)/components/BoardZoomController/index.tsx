'use client'

import boardStore, { MAX_SCALE, MIN_SCALE } from '@/shared/components/Board/board.store'
import Range from '@/shared/components/Range'
import { ZoomInIcon, ZoomOutIcon } from 'lucide-react'
import type { JSX } from 'react'

import './style.scss'

interface IBoardZoomController {
  className?: string
}

const BoardZoomController = ({ className = '' }: IBoardZoomController): JSX.Element => {
  const { scale, setScale } = boardStore()

  const handleChangeScale = (value: number): void => {
    const newZoom = Math.min(Math.max(scale + value, MIN_SCALE), MAX_SCALE)
    setScale(newZoom)
  }
  return (
    <div className={`boardZoomCtrl ${className}`}>
      <button className='boardZoomCtrl-action' onClick={() => handleChangeScale(0.1)}>
        <ZoomInIcon />
      </button>
      <Range typeRange='vertical' rangeValue={scale} handleChange={setScale} min={MIN_SCALE} max={MAX_SCALE} step={0.005} />
      <button className='boardZoomCtrl-action' onClick={() => handleChangeScale(-0.1)}>
        <ZoomOutIcon />
      </button>
    </div>
  )
}

export default BoardZoomController
