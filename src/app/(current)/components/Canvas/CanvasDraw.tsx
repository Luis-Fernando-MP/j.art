'use client'

import Board from '@/shared/components/Board'
import { JSX, useRef, useState } from 'react'

import { getContext } from '../../helpers/canvas.utils'
import CanvasStore from '../../store/canvas.store'

type CanvasProps = {
  scale: number
}

const CanvasComponent = ({ scale }: CanvasProps): JSX.Element => {
  const $canvasRef = useRef<HTMLCanvasElement>(null)

  const [isDrawing, setIsDrawing] = useState(false)

  const { pixelColor, pixelOpacity, pixelSize } = CanvasStore()
  const PIXEL_SIZE = pixelSize

  const getCanvasCoordinates = (e: React.MouseEvent) => {
    const { canvas } = getContext()
    const rect = canvas.getBoundingClientRect()
    return { x: (e.clientX - rect.left) / scale, y: (e.clientY - rect.top) / scale }
  }

  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    if (!e.ctrlKey) {
      const positions = getCanvasCoordinates(e)
      setIsDrawing(true)
      handleDrawing(positions.x, positions.y)
    }
  }

  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    if (isDrawing) {
      const positions = getCanvasCoordinates(e)
      handleDrawing(positions.x, positions.y)
    }
  }

  const handleCanvasMouseUp = () => {
    setIsDrawing(false)
  }

  const drawPixel = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    color: string,
    size: number,
    opacity = 1
  ) => {
    ctx.globalAlpha = opacity
    ctx.fillStyle = color
    ctx.fillRect(x, y, size, size)
    ctx.globalAlpha = 1
  }

  const handleDrawing = (x: number, y: number) => {
    const canvas = $canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    const alignedX = Math.floor(x / PIXEL_SIZE) * PIXEL_SIZE
    const alignedY = Math.floor(y / PIXEL_SIZE) * PIXEL_SIZE

    drawPixel(ctx, alignedX, alignedY, pixelColor, pixelSize, pixelOpacity)
  }

  return (
    <>
      <div className='canvas-background' />
      <canvas
        className='canvas-draw'
        id='canvas'
        ref={$canvasRef}
        width={930}
        height={930}
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
  return (
    <Board>
      {(_, scale) => {
        return <CanvasComponent scale={scale} />
      }}
    </Board>
  )
}

export default CanvasDraw
