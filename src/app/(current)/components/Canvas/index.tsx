import { type JSX, memo } from 'react'

import useCanvas from '../../hooks/useCanvas'
import CanvasStore from '../../store/canvas.store'
import './style.scss'

interface ICanvas {
  canvasId: string
}

const Canvas = ({ canvasId }: ICanvas): JSX.Element => {
  const { dimensions } = CanvasStore()
  const { $canvasRef, handleCanvasMouseDown, handleCanvasMouseMove, handleCanvasMouseUp } = useCanvas({ canvasId })

  return (
    <canvas
      className='canvasDraw'
      id={canvasId}
      ref={$canvasRef}
      width={dimensions.width}
      height={dimensions.height}
      onMouseDown={handleCanvasMouseDown}
      onMouseMove={handleCanvasMouseMove}
      onMouseUp={handleCanvasMouseUp}
      onMouseLeave={handleCanvasMouseUp}
    />
  )
}

export default memo(Canvas)
