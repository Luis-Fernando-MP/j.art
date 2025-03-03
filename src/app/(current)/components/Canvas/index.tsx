import { acl } from '@/shared/acl'
import { type JSX, memo } from 'react'

import useUseDrawPreview from '../../hooks/UseDrawPreview'
import useCanvas from '../../hooks/useCanvas'
import './style.scss'

interface ICanvas {
  canvasId: string
  isActive: boolean
  isWatching: boolean
}

const Canvas = ({ canvasId, isActive, isWatching }: ICanvas): JSX.Element => {
  const { $canvasRef, handleCanvasMouseDown, handleCanvasMouseMove } = useCanvas({
    canvasId
  })
  useUseDrawPreview({ $canvasRef })

  return (
    <canvas
      className={`canvasDraw ${acl(isActive, 'selected')}`}
      style={{ display: isWatching ? 'block' : 'none' }}
      id={canvasId}
      ref={$canvasRef}
      onMouseDown={handleCanvasMouseDown}
      onMouseMove={handleCanvasMouseMove}
    />
  )
}

export default memo(Canvas)
