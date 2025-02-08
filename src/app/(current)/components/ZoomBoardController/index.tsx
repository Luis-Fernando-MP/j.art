import { acl } from '@/shared/acl'
import boardStore from '@/shared/components/Board/board.store'
import Popup from '@/shared/components/Popup'
import { LockIcon, PictureInPicture2Icon, UnlockIcon } from 'lucide-react'
import { type JSX, memo, useState } from 'react'

import BoardZoomController from '../BoardZoomController'
import CanvasViewer from '../CanvasViewer'
import './style.scss'

const RenderCanvasViewer = memo(() => {
  return (
    <article className='zoomController-canvasViewer'>
      <CanvasViewer />
      <BoardZoomController />
    </article>
  )
})

const ZoomBoardController = (): JSX.Element => {
  const [isPopup, setIsPopup] = useState(false)
  const { setEnableScroll, enableScroll } = boardStore()

  return (
    <section className='zoomController'>
      <div className='zoomController-options'>
        <button onClick={() => setIsPopup(!isPopup)}>
          Popup
          <PictureInPicture2Icon />
        </button>
        <button className={`${acl(enableScroll)}`} onClick={() => setEnableScroll(!enableScroll)}>
          Zoom
          {enableScroll ? <LockIcon /> : <UnlockIcon />}
        </button>
      </div>

      {isPopup && (
        <Popup isOpen={isPopup} onClose={() => setIsPopup(false)}>
          <RenderCanvasViewer />
        </Popup>
      )}
      {!isPopup && <RenderCanvasViewer />}
    </section>
  )
}

export default ZoomBoardController
