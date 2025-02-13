'use client'

import type { JSX } from 'react'

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
      <ZoomBoardController />
      <section className='rightTools-container'>
        <CanvasLayers />
        <CanvasTools />
      </section>
    </section>
  )
}

export default RightTools
