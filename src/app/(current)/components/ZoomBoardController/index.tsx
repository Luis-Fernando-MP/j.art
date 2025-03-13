import { acl } from '@/shared/acl'
import boardStore from '@/shared/components/Board/board.store'
import Popup from '@/shared/components/Popup'
import { PopupPositions } from '@/shared/components/Popup/usePopup'
import { LockIcon, PictureInPicture2Icon, UnlockIcon } from 'lucide-react'
import { type JSX, MouseEvent, memo, useEffect, useState } from 'react'

import RepaintDrawingStore from '../../store/repaintDrawing.store'
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

RenderCanvasViewer.displayName = 'RenderCanvasViewer'

interface IZoomBoardController {
  className: string
}

const ZoomBoardController = ({ className }: IZoomBoardController): JSX.Element => {
  const [isPopup, setIsPopup] = useState(false)
  const [positions, setPositions] = useState<PopupPositions>()
  const { setEnableScroll, enableScroll } = boardStore()
  const { setRepaint } = RepaintDrawingStore()

  useEffect(() => {
    setRepaint('zoom')
  }, [isPopup])

  const handleClick = (e: MouseEvent): void => {
    setIsPopup(!isPopup)
    setPositions({ x: e.clientX, y: e.clientY })
  }

  return (
    <section className={`zoomController ${className}`} id='zoomController'>
      <div className='zoomController-options'>
        <button onClick={handleClick}>
          Popup
          <PictureInPicture2Icon />
        </button>
        <button className={`${acl(enableScroll)}`} onClick={() => setEnableScroll(!enableScroll)}>
          Zoom
          {enableScroll ? <LockIcon /> : <UnlockIcon />}
        </button>
      </div>

      {isPopup && (
        <Popup isOpen={isPopup} onClose={() => setIsPopup(false)} clickPosition={positions}>
          <RenderCanvasViewer />
        </Popup>
      )}
      {!isPopup && <RenderCanvasViewer />}
    </section>
  )
}

export default ZoomBoardController
