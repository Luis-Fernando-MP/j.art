import { type JSX } from 'react'

import BackgroundStyleTools from '../BackgroundStyleTools'
import CanvasRangeTools from '../CanvasRangeTools'
import UtilityTools from './UtilityTools'
import './style.scss'

const CanvasTools = (): JSX.Element => {
  return (
    <article className='rightTools-section' id='tools'>
      <h5>Herramientas</h5>
      <aside className='rightTools-wrapper'>
        <BackgroundStyleTools />
        <section className='canvasTools'>
          <UtilityTools />
          <CanvasRangeTools />
        </section>
      </aside>
    </article>
  )
}

export default CanvasTools
