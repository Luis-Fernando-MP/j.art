'use client'

import type { JSX } from 'react'

import CanvasFile from '../CanvasFile'
import CanvasLayers from '../CanvasLayers'
import CanvasTools from '../CanvasTools'
import ZoomBoardController from '../ZoomBoardController'
import './style.scss'

interface IRightTools {
  className?: string
}

const RightTools = ({ className = '' }: IRightTools): JSX.Element => {
  return (
    <section className={`${className} rightTools`}>
      <ZoomBoardController className='rightTools-zoomController' />
      <section className='rightTools-container'>
        <CanvasLayers />
        <CanvasTools />
        <CanvasFile />
      </section>
    </section>
  )
}

export default RightTools
