import boardStore from '@/shared/components/Board/board.store'
import type { JSX } from 'react'

import useCanvas from '../../hooks/useCanvas'
import CanvasStore from '../../store/canvas.store'

interface ICanvas {
  className?: string
  canvasId: string
}

const Canvas = ({ className = '', canvasId }: ICanvas): JSX.Element => {
  const { dimensions } = CanvasStore()
  const { $canvasRef, handleCanvasMouseDown, handleCanvasMouseMove, handleCanvasMouseUp } = useCanvas({ canvasId })

  return (
    <section
      className={`${className}`}
      key={canvasId}
      style={{
        minWidth: dimensions.width,
        width: dimensions.width,
        height: dimensions.height,
        minHeight: dimensions.height
      }}
    >
      <div className='appDraw-board__background' />
      <canvas
        className='appDraw-board__canvas'
        id={canvasId}
        ref={$canvasRef}
        onMouseDown={handleCanvasMouseDown}
        onMouseMove={handleCanvasMouseMove}
        onMouseUp={handleCanvasMouseUp}
        onMouseLeave={handleCanvasMouseUp}
      />
      <div className='appDraw-board__grid' />
    </section>
  )
}

export default Canvas
