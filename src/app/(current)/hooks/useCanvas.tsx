'use client'

import { alignCord } from '@scripts/bresenham'
import {
  HandleDeletePixel,
  getCanvasCoordinates,
  handleDrawPixel,
  handlePaintBucket,
  handlePipetteColor
} from '@scripts/toolsCanvas'
import { getContext } from '@scripts/transformCanvas'
import { MouseEvent, useEffect, useMemo, useRef, useState } from 'react'

import { TPositions } from '../store/canvas.store'
import PixelStore from '../store/pixel.store'
import RepaintDrawingStore from '../store/repaintDrawing.store'
import ToolsStore from '../store/tools.store'

type TUseCanvas = { canvasId: string }

const useCanvas = ({ canvasId }: TUseCanvas) => {
  // const { scale } = boardStore()
  const $canvasRef = useRef<HTMLCanvasElement>(null)
  const $perfectShape = useRef(false)

  const [isDrawing, setIsDrawing] = useState(false)
  const startPos = useRef<TPositions | null>(null)
  const canvasSnapshot = useRef<ImageData | null>(null)
  const { setRepaint } = RepaintDrawingStore()

  const { pixelColor, pixelOpacity, pixelSize, setPixelColor } = PixelStore()
  const { selectedTool, xMirror, yMirror } = ToolsStore()
  // const { activeLayer, listOfLayers, setListOfLayers, idParentLayer } = LayerStore()
  // const { listOfLayers } = LayerStore()

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
    [pixelColor, pixelSize, pixelOpacity, xMirror, yMirror, setPixelColor]
  )

  const handleCanvasMouseDown = (e: MouseEvent) => {
    if (e.ctrlKey) return
    e.preventDefault()
    setIsDrawing(true)

    const { x, y } = getCanvasCoordinates(e, canvasId)
    startPos.current = { x, y }
    handleDrawing(x, y)
    // if (!(selectedTool in shapeTools) || canvasSnapshot.current) return
    // const { ctx } = getContext(canvasId)
    // canvasSnapshot.current = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height)
  }

  const handleCanvasMouseMove = (e: MouseEvent) => {
    if (!isDrawing) return
    requestAnimationFrame(() => {
      // activatePerfectShape(e.shiftKey)
      const { x, y } = getCanvasCoordinates(e, canvasId)
      handleDrawing(x, y)
    })
  }

  const handleCanvasMouseUp = () => {
    if (!startPos.current) return
    setIsDrawing(false)
    startPos.current = null
    canvasSnapshot.current = null
    activatePerfectShape(false)
    setRepaint('all')
  }

  const handleDrawing = (x: number, y: number) => {
    if (!startPos.current) return
    const { ctx } = getContext(canvasId)
    const { x: stX, y: stY } = startPos.current

    const startX = alignCord(stX, pixelSize)
    const endX = alignCord(x, pixelSize)
    const startY = alignCord(stY, pixelSize)
    const endY = alignCord(y, pixelSize)

    const dx = Math.abs(endX - startX) / pixelSize
    const dy = Math.abs(endY - startY) / pixelSize
    let steps = Math.max(dx, dy)
    if (startX === endX && startY === endY) {
      steps = 1
    }

    for (let i = 0; i <= steps; i++) {
      const px = startX + (endX - startX) * (i / steps)
      const py = startY + (endY - startY) * (i / steps)
      handleDrawPixel({
        ctx,
        x: alignCord(px, pixelSize),
        y: alignCord(py, pixelSize),
        pixelColor,
        pixelSize: pixelSize,
        pixelOpacity,
        xMirror,
        yMirror
      })
    }

    startPos.current = { x, y }
  }

  useEffect(() => {
    document.addEventListener('mouseup', handleCanvasMouseUp)
    return () => {
      document.removeEventListener('mouseup', handleCanvasMouseUp)
    }
  }, [])

  return {
    $canvasRef,
    handleCanvasMouseDown,
    handleCanvasMouseMove
  }
}

export default useCanvas
