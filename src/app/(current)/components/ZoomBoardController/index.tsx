import { LockIcon, PictureInPicture2Icon } from 'lucide-react'
import type { JSX } from 'react'

import BoardZoomController from '../BoardZoomController'
import './style.scss'

const ZoomBoardController = (): JSX.Element => {
  return (
    <section className='zoomController'>
      <div className='zoomController-options'>
        <button>
          Popup
          <PictureInPicture2Icon />
        </button>
        <button className='active'>
          Zoom
          <LockIcon />
        </button>
      </div>

      <article className='zoomController-canvasViewer'>
        <div className='canvasViewer'>
          <canvas className='canvasViewer-canvas' />
          <button className='canvasViewer-camera'>camera</button>
        </div>
        <BoardZoomController />
      </article>
    </section>
  )
}

export default ZoomBoardController
