import { acl } from '@/shared/acl'
import { type JSX, memo } from 'react'

import useCanvas from '../../hooks/useCanvas'
import CanvasStore from '../../store/canvas.store'
import './style.scss'

interface ICanvas {
  canvasId: string
  isActive: boolean
}

const Canvas = ({ canvasId, isActive }: ICanvas): JSX.Element => {
  const { dimensions } = CanvasStore()
  const { $canvasRef, handleCanvasMouseDown, handleCanvasMouseMove, handleCanvasMouseUp, handleCanvasMouseLeave } = useCanvas({
    canvasId
  })

  return (
    <canvas
      className={`canvasDraw ${acl(isActive)}`}
      id={canvasId}
      ref={$canvasRef}
      width={dimensions.width}
      height={dimensions.height}
      onMouseDown={handleCanvasMouseDown}
      onMouseMove={handleCanvasMouseMove}
      onMouseUp={handleCanvasMouseUp}
      onMouseLeave={handleCanvasMouseLeave}
    />
  )
}

export default memo(Canvas)
