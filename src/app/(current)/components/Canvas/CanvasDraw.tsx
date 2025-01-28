'use client'

import Board from '@/shared/components/Board'
import { JSX, useRef, useState } from 'react'

import {
  IShapeBresenham,
  alignCord,
  drawAppleBresenham,
  drawCircleBresenham,
  drawCloverBresenham,
  drawCrossBresenham,
  drawCrownBresenham,
  drawDiamondBresenham,
  drawExBresenham,
  drawHeartBresenham,
  drawHexagonBresenham,
  drawHouseBresenham,
  drawLineBresenham,
  drawPentagonBresenham,
  drawRightTriangleBresenham,
  drawSquareBresenham,
  drawStarBresenham,
  drawSwordBresenham,
  drawTorusBresenham,
  drawTriangleBresenham,
  drawXBresenham
} from '../../helpers/bresenham'
import { getContext } from '../../helpers/canvas.utils'
import CanvasStore, { TPositions } from '../../store/canvas.store'
import ToolsStore, { Tools } from '../../store/tools.store'

type CanvasProps = {
  scale: number
}

const CanvasComponent = ({ scale }: CanvasProps): JSX.Element => {
  const $canvasRef = useRef<HTMLCanvasElement>(null)
  const $perfectShape = useRef(false)

  const [isDrawing, setIsDrawing] = useState(false)
  const startPos = useRef<TPositions | null>(null)
  const canvasSnapshot = useRef<ImageData | null>(null)

  const { pixelColor, pixelOpacity, pixelSize, setPixelColor } = CanvasStore()

  const { selectedTool } = ToolsStore()

  const getCanvasCoordinates = (e: React.MouseEvent) => {
    const { canvas } = getContext()
    const rect = canvas.getBoundingClientRect()
    return { x: (e.clientX - rect.left) / scale, y: (e.clientY - rect.top) / scale }
  }

  const activatePerfectShape = (isActive: boolean = true) => {
    if ($perfectShape.current === isActive) return
    $perfectShape.current = isActive
    const $span = document.getElementById('perfect-shape')
    if (!($span instanceof HTMLSpanElement)) return
    $span.classList.toggle('active', isActive)
  }

  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    if (e.ctrlKey) return
    e.preventDefault()

    const positions = getCanvasCoordinates(e)
    setIsDrawing(true)
    handleDrawing(positions.x, positions.y)
    startPos.current = {
      x: positions.x,
      y: positions.y
    }

    if (
      selectedTool === Tools.Square ||
      selectedTool === Tools.Circle ||
      selectedTool === Tools.Pentagon ||
      selectedTool === Tools.Hexagon ||
      selectedTool === Tools.Triangle ||
      selectedTool === Tools.RightTriangle ||
      selectedTool === Tools.Line ||
      selectedTool === Tools.X ||
      selectedTool === Tools.Torus ||
      selectedTool === Tools.Heart ||
      selectedTool === Tools.House ||
      selectedTool === Tools.Star
    ) {
      if (canvasSnapshot.current) return
      const { ctx } = getContext()
      canvasSnapshot.current = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height)
    }
  }

  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    if (!isDrawing) return
    activatePerfectShape(e.shiftKey)
    const positions = getCanvasCoordinates(e)
    handleDrawing(positions.x, positions.y)
  }

  const handleCanvasMouseUp = () => {
    setIsDrawing(false)
    startPos.current = null
    canvasSnapshot.current = null
    activatePerfectShape(false)
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

  const deletePixel = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
    ctx.clearRect(x, y, size, size)
  }

  const getPixelColor = (
    imageData: ImageData,
    alignedX: number,
    alignedY: number,
    width: number
  ): [number, number, number, number] => {
    const index = (alignedY * width + alignedX) * 4
    const pixelData = imageData.data
    return [
      pixelData[index], // Red
      pixelData[index + 1], // Green
      pixelData[index + 2], // Blue
      pixelData[index + 3] // Alpha
    ]
  }

  function paintBucket(
    ctx: CanvasRenderingContext2D,
    startX: number,
    startY: number,
    fillColor: [number, number, number, number]
  ) {
    const { width, height } = ctx.canvas
    const imageData = ctx.getImageData(0, 0, width, height)
    const pixelData = imageData.data
    const getIndex = (x: number, y: number) => (y * width + x) * 4
    const isInsideCanvas = (x: number, y: number) => x >= 0 && x < width && y >= 0 && y < height

    const startColor = getPixelColor(imageData, Math.floor(startX), Math.floor(startY), width)

    // Si el color inicial es igual al color de relleno
    if (startColor.every((v, i) => v === fillColor[i])) return

    const isSameColor = (index: number) =>
      pixelData[index] === startColor[0] &&
      pixelData[index + 1] === startColor[1] &&
      pixelData[index + 2] === startColor[2] &&
      pixelData[index + 3] === startColor[3]

    const stack: [number, number][] = [[Math.floor(startX), Math.floor(startY)]]

    while (stack.length > 0) {
      const [currentX, currentY] = stack.pop()!
      if (!isInsideCanvas(currentX, currentY)) continue
      const currentIndex = getIndex(currentX, currentY)
      if (!isSameColor(currentIndex)) continue

      // Pintar el píxel actual
      pixelData[currentIndex] = fillColor[0]
      pixelData[currentIndex + 1] = fillColor[1]
      pixelData[currentIndex + 2] = fillColor[2]
      pixelData[currentIndex + 3] = fillColor[3]

      // Añadir píxeles vecinos a la pila
      stack.push([currentX - 1, currentY]) // Izquierda
      stack.push([currentX + 1, currentY]) // Derecha
      stack.push([currentX, currentY - 1]) // Arriba
      stack.push([currentX, currentY + 1]) // Abajo
    }
    ctx.putImageData(imageData, 0, 0)
  }

  const handleDrawing = (x: number, y: number) => {
    const { ctx } = getContext()
    const endX = alignCord(x, pixelSize)
    const endY = alignCord(y, pixelSize)

    if (selectedTool === Tools.Brush) {
      drawPixel(ctx, endX, endY, pixelColor, pixelSize, pixelOpacity)
    }

    if (selectedTool === Tools.Bucket) {
      paintBucket(ctx, x, y, [255, 0, 0, 255])
    }

    if (selectedTool === Tools.Eraser) {
      deletePixel(ctx, endX, endY, pixelSize)
    }

    if (selectedTool === Tools.Pipette) {
      const { width, height } = ctx.canvas
      const imageData = ctx.getImageData(0, 0, width, height)
      const [r, g, b, a] = getPixelColor(imageData, Math.floor(x), Math.floor(y), width)
      const color = `rgba(${r}, ${g}, ${b}, ${a})`
      setPixelColor(color)
      console.log(color)
    }

    if (!startPos.current) return
    const { x: stX, y: stY } = startPos.current
    const startX = alignCord(stX, pixelSize)
    const startY = alignCord(stY, pixelSize)

    const shapeProps: IShapeBresenham = {
      ctx,
      startX,
      startY,
      endX,
      endY,
      pixelColor,
      pixelSize,
      snapshot: canvasSnapshot.current,
      perfectShape: $perfectShape.current
    }

    if (selectedTool === Tools.Square) {
      return drawSquareBresenham(shapeProps)
    }

    if (selectedTool === Tools.Circle) {
      return drawCircleBresenham(shapeProps)
    }

    if (selectedTool === Tools.Pentagon) {
      return drawPentagonBresenham(shapeProps)
    }

    if (selectedTool === Tools.Triangle) {
      return drawTriangleBresenham(shapeProps)
    }

    if (selectedTool === Tools.Line) {
      return drawLineBresenham(shapeProps)
    }

    if (selectedTool === Tools.RightTriangle) {
      return drawRightTriangleBresenham(shapeProps)
    }
    if (selectedTool === Tools.Hexagon) {
      return drawHexagonBresenham(shapeProps)
    }
    if (selectedTool === Tools.Torus) {
      return drawTorusBresenham(shapeProps)
    }
    if (selectedTool === Tools.Heart) {
      return drawHeartBresenham(shapeProps)
    }
    if (selectedTool === Tools.Star) {
      return drawStarBresenham(shapeProps)
    }
    if (selectedTool === Tools.House) {
      return drawHouseBresenham(shapeProps)
    }
    if (selectedTool === Tools.X) {
      return drawXBresenham(shapeProps)
    }
  }

  return (
    <>
      <div className='canvas-background' />
      <canvas
        className='canvas-draw'
        id='canvas'
        ref={$canvasRef}
        width={900}
        height={900}
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
