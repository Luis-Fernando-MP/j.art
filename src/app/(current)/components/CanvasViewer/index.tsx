'use client'

import dynamic from 'next/dynamic'
import React, { useRef } from 'react'

import CanvasStore from '../../store/canvas.store'
import './style.scss'

const CameraViewer = dynamic(() => import('./CameraViewer'), {
  ssr: false
})

const CanvasViewer: React.FC = () => {
  const { dimensions } = CanvasStore()
  const { width: originalWidth, height: originalHeight } = dimensions

  const $canvas = useRef<HTMLCanvasElement>(null)
  const $parentRef = useRef<HTMLDivElement>(null)

  const maxWidth = 230
  const maxHeight = 180
  const canvasWidth = Math.min(maxWidth, originalWidth * 0.5)
  const canvasHeight = Math.min(maxHeight, originalHeight * 0.5)

  return (
    <div className='canvasViewer'>
      <div className='canvasViewer-background' />
      <div className='canvasViewer-wrapper' ref={$parentRef} style={{ width: canvasWidth, height: canvasHeight }}>
        <canvas className='canvasViewer-canvas' ref={$canvas} width={canvasWidth} height={canvasHeight} />
        <CameraViewer $canvas={$canvas} canvasHeight={canvasHeight} canvasWidth={canvasWidth} />
      </div>
    </div>
  )
}

export default CanvasViewer
