'use client'

import Juls from '@/shared/assets/Juls'
import Board from '@/shared/components/Board'
import { JSX } from 'react'

import useCanvas from '../../hooks/useCanvas'

type CanvasProps = {
  scale: number
}

const CanvasComponent = ({ scale }: CanvasProps): JSX.Element => {
  const { $canvasRef, handleCanvasMouseDown, handleCanvasMouseMove, handleCanvasMouseUp } = useCanvas({ scale })

  return (
    <>
      <div className='canvas-background' />
      <canvas
        className='canvas-draw'
        id='canvas'
        ref={$canvasRef}
        width={1200}
        height={1200}
        onMouseDown={handleCanvasMouseDown}
        onMouseMove={handleCanvasMouseMove}
        onMouseUp={handleCanvasMouseUp}
        onMouseLeave={handleCanvasMouseUp}
        style={{
          position: 'relative',
          zIndex: 1
        }}
      />
      <div className='canvas-grid' id='canvas-grid' />
    </>
  )
}

const CanvasDraw = (): JSX.Element => {
  return <Board>{(_, scale) => <CanvasComponent scale={scale} />}</Board>
}

export default CanvasDraw
