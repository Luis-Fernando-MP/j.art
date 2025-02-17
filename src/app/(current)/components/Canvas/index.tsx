import { acl } from '@/shared/acl'
import { type JSX, memo } from 'react'

import useUseDrawPreview from '../../hooks/UseDrawPreview'
import useCanvas from '../../hooks/useCanvas'
import CanvasStore from '../../store/canvas.store'
import './style.scss'

interface ICanvas {
  canvasId: string
  isActive: boolean
}

const Canvas = ({ canvasId, isActive }: ICanvas): JSX.Element => {
  const { dimensions } = CanvasStore()
  const { $canvasRef, handleCanvasMouseDown, handleCanvasMouseMove } = useCanvas({
    canvasId
  })
  useUseDrawPreview({ $canvasRef })

  return (
    <canvas
      className={`canvasDraw ${acl(isActive, 'selected')}`}
      id={canvasId}
      ref={$canvasRef}
      width={dimensions.width}
      height={dimensions.height}
      onMouseDown={handleCanvasMouseDown}
      onMouseMove={handleCanvasMouseMove}
    />
  )
}

export default memo(Canvas)
