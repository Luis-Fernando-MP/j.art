import dynamic from 'next/dynamic'
import { type JSX } from 'react'

import LayerStore from '../../store/layer.store'
import './style.scss'

const CanvasToolsComponent = dynamic(() => import('./CanvasToolsComponent'), {
  ssr: false
})

const CanvasTools = (): JSX.Element => {
  const { activeLayer } = LayerStore()

  return (
    <article className='rightTools-section' id='tools'>
      <h5>Herramientas</h5>
      <aside className='rightTools-wrapper canvasTools'>
        <CanvasToolsComponent currentLayerID={activeLayer.id} />
      </aside>
    </article>
  )
}

export default CanvasTools
