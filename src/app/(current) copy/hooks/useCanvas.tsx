'use client'

import { IShapeBresenham, alignCord } from '@scripts/bresenham'
import {
  HandleDeletePixel,
  getCanvasCoordinates,
  handleDrawPixel,
  handlePaintBucket,
  handlePipetteColor
} from '@scripts/toolsCanvas'
import { getContext } from '@scripts/transformCanvas'
import { MouseEvent, useMemo, useRef, useState } from 'react'

import CanvasStore, { TPositions } from '../store/canvas.store'
import ToolsStore from '../store/tools.store'
import { ShapeTools, handleBresenhamTools, shapeTools } from '../store/tools.types'

type TUseCanvas = { scale: number }

const useCanvas = ({ scale }: TUseCanvas) => {
  const $canvasRef = useRef<HTMLCanvasElement>(null)
  const $perfectShape = useRef(false)

  const [isDrawing, setIsDrawing] = useState(false)
  const startPos = useRef<TPositions | null>(null)
  const canvasSnapshot = useRef<ImageData | null>(null)

  const { pixelColor, pixelOpacity, pixelSize, setPixelColor } = CanvasStore()
  const { selectedTool, xMirror, yMirror } = ToolsStore()

  const activatePerfectShape = (isActive: boolean = true) => {
    $perfectShape.current = isActive
    const $span = document.getElementById('perfect-shape')
    if (!($span instanceof HTMLSpanElement)) return
    $span.classList.toggle('active', isActive)
  }

  const handleUtilTools = useMemo(
    () => ({
      Brush: (ctx: CanvasRenderingContext2D, x: number, y: number) =>
        handleDrawPixel({
          ctx,
          x,
          y,
          pixelColor,
          pixelSize,
          pixelOpacity,
          xMirror,
          yMirror
        }),
      Bucket: (ctx: CanvasRenderingContext2D, x: number, y: number) => handlePaintBucket(ctx, x, y, pixelColor),
      Eraser: (ctx: CanvasRenderingContext2D, x: number, y: number) =>
        HandleDeletePixel({ ctx, x, y, pixelSize, xMirror, yMirror }),
      Pipette: (ctx: CanvasRenderingContext2D, x: number, y: number) => {
        const color = handlePipetteColor(ctx, x, y)
        setPixelColor(color.rgba)
        console.log(color)
      }
    }),
    [pixelColor, pixelSize, pixelOpacity, xMirror, yMirror]
  )

  const handleCanvasMouseDown = (e: MouseEvent) => {
    if (e.ctrlKey) return
    e.preventDefault()
    setIsDrawing(true)
    const { x, y } = getCanvasCoordinates(e, scale)
    startPos.current = { x, y }
    handleDrawing(x, y)

    if (!(selectedTool in shapeTools) || canvasSnapshot.current) return
    const { ctx } = getContext()
    canvasSnapshot.current = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height)
  }

  const handleCanvasMouseMove = (e: MouseEvent) => {
    if (!isDrawing) return
    activatePerfectShape(e.shiftKey)
    const { x, y } = getCanvasCoordinates(e, scale)
    handleDrawing(x, y)
  }

  const handleCanvasMouseUp = () => {
    setIsDrawing(false)
    startPos.current = null
    canvasSnapshot.current = null
    activatePerfectShape(false)
  }

  const handleDrawing = (x: number, y: number) => {
    const { ctx } = getContext()
    const endX = alignCord(x, pixelSize)
    const endY = alignCord(y, pixelSize)
    if (selectedTool in handleUtilTools) {
      const handleTool = handleUtilTools[selectedTool as keyof typeof handleUtilTools]
      return handleTool(ctx, endX, endY)
    }

    if (selectedTool in shapeTools && canvasSnapshot.current && startPos.current) {
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
      return handleBresenhamTools[selectedTool as ShapeTools](shapeProps)
    }
  }

  return {
    $canvasRef,
    handleCanvasMouseDown,
    handleCanvasMouseMove,
    handleCanvasMouseUp
  }
}

export default useCanvas
