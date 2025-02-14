import dynamic from 'next/dynamic'
import { type JSX } from 'react'

import ActiveDrawsStore from '../../store/ActiveDraws.store'
import './style.scss'

const CanvasToolsComponent = dynamic(() => import('./CanvasToolsComponent'), {
  ssr: false
})

const CanvasTools = (): JSX.Element => {
  const { actLayerId } = ActiveDrawsStore()

  return (
    <article className='rightTools-section' id='tools'>
      <h5>Herramientas</h5>
      <aside className='rightTools-wrapper canvasTools'>
        <CanvasToolsComponent currentLayerID={actLayerId} />
      </aside>
    </article>
  )
}

export default CanvasTools
