'use client'

import { Image } from '@unpic/react'
import dynamic from 'next/dynamic'
import React, { JSX, useRef } from 'react'

import CanvasStore from '../../store/canvas.store'
import './style.scss'

const CameraViewer = dynamic(() => import('./CameraViewer'), {
  ssr: false
})

const CanvasViewer = (): JSX.Element => {
  const { dimensions } = CanvasStore()
  const { width: originalWidth, height: originalHeight } = dimensions
  const $parentRef = useRef<HTMLDivElement>(null)

  const maxWidth = 230
  const maxHeight = 180
  const canvasWidth = Math.min(maxWidth, originalWidth * 0.5)
  const canvasHeight = Math.min(maxHeight, originalHeight * 0.5)

  return (
    <div className='canvasViewer'>
      <div className='canvasViewer-background' />
      <div className='canvasViewer-wrapper' ref={$parentRef} style={{ width: canvasWidth, height: canvasHeight }}>
        <Image
          className='canvasViewer-image'
          src='/images/blank-image.webp'
          alt='viewer-frame'
          layout='fullWidth'
          id='viewer-frame'
        />
        <CameraViewer $canvas={$parentRef} canvasHeight={canvasHeight} canvasWidth={canvasWidth} />
      </div>
    </div>
  )
}

export default CanvasViewer
