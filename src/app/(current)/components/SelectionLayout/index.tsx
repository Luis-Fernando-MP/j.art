import boardStore from '@/shared/components/Board/board.store'
import { CopyIcon, MoveIcon, ScissorsIcon } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'

import ActiveDrawsStore from '../../store/ActiveDraws.store'
import CanvasStore from '../../store/canvas.store'
import SelectionStore from '../../store/selection.store'
// import SelectionStore from '../../store/selection.store'
import './style.scss'

const SelectionLayout = () => {
  const { actParentId, actLayerId } = ActiveDrawsStore()
  const { scale } = boardStore()
  const [currentFrame, setCurrentFrame] = useState<HTMLDivElement | null>(null)
  const { dimensions } = CanvasStore()
  const { selection } = SelectionStore()

  useEffect(() => {
    const checkForFrame = () => {
      const frameElement = document.getElementById(actParentId)
      setCurrentFrame((frameElement as HTMLDivElement) || null)
    }
    checkForFrame()
    const observer = new MutationObserver(() => checkForFrame())
    observer.observe(document.body, { childList: true, subtree: true })
    return () => observer.disconnect()
  }, [actParentId])

  const handleMoveSelection = () => {
    const $layer = document.getElementById(actLayerId)
    if (!($layer instanceof HTMLCanvasElement)) return
    const ctx = $layer.getContext('2d')
    if (!ctx) return

    const { startX, startY, width, height } = selection

    const imageData = ctx.getImageData(startX, startY, width, height)

    ctx.clearRect(startX, startY, width, height)

    ctx.putImageData(imageData, 0, 0)
  }

  const renderPortal = useMemo(() => {
    if (!currentFrame) return null

    const inverseScale = Math.max(0.5, Math.min(1, 1 / scale))

    const containerFactor = Math.max(0.8, Math.min(1.2, Math.min(dimensions.width, dimensions.height) / 800))

    return (
      <section className='selection' id='selection'>
        <div className='selection-container' />
        <div
          className='selection-actions'
          style={{
            scale: `${inverseScale * containerFactor}`,
            transformOrigin: 'top left'
          }}
        >
          <button className='selection-action'>
            <CopyIcon />
          </button>
          <button className='selection-action'>
            <ScissorsIcon />
          </button>
          <button className='selection-action' onClick={handleMoveSelection}>
            <MoveIcon />
          </button>
        </div>
      </section>
    )
  }, [scale, currentFrame, selection])

  return currentFrame ? createPortal(renderPortal, currentFrame) : null
}

export default SelectionLayout
