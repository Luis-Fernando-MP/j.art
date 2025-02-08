'use client'

import { type JSX } from 'react'

import CanvasLayersActions from './CanvasLayersActions'
import CanvasListLayers from './CanvasListLayers'
import './style.scss'

const CanvasLayers = (): JSX.Element | null => {
  return (
    <section className='canvasLayers' id='layers'>
      <h5>Capas</h5>
      <div className='canvasLayers-wrapper'>
        <CanvasLayersActions />
        <CanvasListLayers />
      </div>
    </section>
  )
}

export default CanvasLayers
