import dynamic from 'next/dynamic'
import { type JSX } from 'react'

import './style.scss'

const CanvasToolsComponent = dynamic(() => import('./CanvasToolsComponent'), {
  ssr: false
})

const CanvasTools = (): JSX.Element => {
  return (
    <article className='rightTools-section' id='tools'>
      <h5>Herramientas</h5>
      <aside className='rightTools-wrapper canvasTools'>
        <CanvasToolsComponent />
      </aside>
    </article>
  )
}

export default CanvasTools
