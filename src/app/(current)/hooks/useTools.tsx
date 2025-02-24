import { alignCord } from '@/scripts/bresenham'
import {
  HandleDeletePixel,
  handleDither,
  handleDrawPixel,
  handleInvertDrawPixel,
  interpolateDrawing,
  moveAllDraw
} from '@/scripts/toolsCanvas'
import { handleWorkerMessage } from '@/shared/handleWorkerMessage'
import { EToolsWorker, ToolsWorkerMessage } from '@workers/speedTools/speedTools.types'
import { useEffect, useRef } from 'react'

import PixelStore from '../store/pixel.store'
import RepaintDrawingStore from '../store/repaintDrawing.store'
import ToolsStore from '../store/tools.store'

type THandleExecuteTools = {
  ctx: CanvasRenderingContext2D
  startX: number
  startY: number
  endX: number
  endY: number
}

let ctx: CanvasRenderingContext2D
let startX: number
let startY: number
let endX: number
let endY: number
let width: number
let height: number

const useTools = () => {
  const { selectedTool, xMirror, yMirror, setSelectedTool } = ToolsStore()
  const { pixelColor, pixelOpacity, pixelSize, setPixelColor } = PixelStore()
  const { setRepaint } = RepaintDrawingStore()

  const toolWorker = useRef<Worker | null>(null)

  useEffect(() => {
    toolWorker.current = new Worker('/workers/speedTools/index.js', { type: 'module' })
    return () => toolWorker.current?.terminate()
  }, [])

  // Eraser: (ctx: CanvasRenderingContext2D, x: number, y: number) =>
  // HandleDeletePixel({ ctx, x, y, pixelSize, xMirror, yMirror }),

  const executeTools = async (props: THandleExecuteTools) => {
    if (selectedTool === 'Cursor') return
    ctx = props.ctx
    startX = alignCord(props.startX, pixelSize)
    startY = alignCord(props.startY, pixelSize)
    endX = alignCord(props.endX, pixelSize)
    endY = alignCord(props.endY, pixelSize)
    width = ctx.canvas.width
    height = ctx.canvas.height

    if (selectedTool in utilTools) {
      return await handleUtilityTools()
    }

    if (selectedTool in selectTools) {
      return await handleSelectTools()
    }

    if (selectedTool in drawTools) {
      return await handleUDrawTools()
    }
  }

  const handleSelectTools = (): void => {
    const tool = selectedTool as keyof typeof selectTools

    if (tool === 'Move') {
      moveAllDraw(ctx, endX - startX, endY - startY)
    }
  }

  const handleUDrawTools = async () => {
    if (!toolWorker.current) return
    const tool = selectedTool as keyof typeof drawTools

    const points = interpolateDrawing({ startX, startY, endX, endY, pixelSize })

    for (const point of points) {
      if (tool === 'Dithering') {
        handleDither({
          ctx,
          x: point.x,
          y: point.y,
          pixelColor,
          pixelSize: pixelSize,
          pixelOpacity,
          xMirror,
          yMirror
        })
      }

      if (tool === 'Brush') {
        handleDrawPixel({
          ctx,
          x: point.x,
          y: point.y,
          pixelColor,
          pixelSize: pixelSize,
          pixelOpacity,
          xMirror,
          yMirror
        })
      }

      if (tool === 'InvertBrush') {
        handleInvertDrawPixel({
          ctx,
          x: point.x,
          y: point.y,
          pixelColor,
          pixelSize: pixelSize,
          pixelOpacity,
          xMirror,
          yMirror
        })
      }

      if (tool === 'Eraser') {
        HandleDeletePixel({
          ctx,
          pixelSize,
          x: point.x,
          y: point.y,
          xMirror,
          yMirror
        })
      }
    }
  }

  const handleUtilityTools = async () => {
    if (!toolWorker.current) return
    const tool = selectedTool as keyof typeof utilTools
    const handleTool = utilTools[tool]

    try {
      const bitmap = await createImageBitmap(ctx.canvas)
      if (!bitmap) return
      const message: ToolsWorkerMessage = handleTool(bitmap)
      toolWorker.current.postMessage(message, [bitmap])
    } catch (error) {
      console.error('Failed to create ImageBitmap for layer view:', error)
    }

    handleWorkerMessage(toolWorker.current, data => {
      const { bitmap, rgba } = data
      if (rgba && selectedTool === 'Pipette') {
        setPixelColor(rgba)
        setSelectedTool('Brush')
      }
      if (bitmap && selectedTool === 'Bucket') {
        ctx.clearRect(0, 0, width, height)
        ctx.drawImage(bitmap, 0, 0)
        setTimeout(() => setRepaint('all'), 50)
      }
    })
  }

  const selectTools = {
    Move: () => {}
  }

  const utilTools = {
    Bucket: (bitmap: ImageBitmap) => ({ action: EToolsWorker.BUCKET, bitmap, startX, startY, fillColor: pixelColor }),
    Pipette: (bitmap: ImageBitmap) => ({ action: EToolsWorker.PIPETTE, bitmap, startX, startY })
  }

  const drawTools = {
    Brush: (bitmap: ImageBitmap) => ({ action: EToolsWorker.BUCKET, bitmap, startX, startY, fillColor: pixelColor }),
    PerfectPixel: (bitmap: ImageBitmap) => ({ action: EToolsWorker.PIPETTE, bitmap, startX, startY }),
    InvertBrush: (bitmap: ImageBitmap) => ({ action: EToolsWorker.PIPETTE, bitmap, startX, startY }),
    Dithering: (bitmap: ImageBitmap) => ({ action: EToolsWorker.PIPETTE, bitmap, startX, startY }),
    Eraser: (bitmap: ImageBitmap) => ({ action: EToolsWorker.PIPETTE, bitmap, startX, startY })
  }

  return { executeTools }
}

export default useTools
