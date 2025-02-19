import { alignCord } from '@/scripts/bresenham'
import { handleDrawPixel, handlePaintBucket, handlePipetteColor, interpolateDrawing } from '@/scripts/toolsCanvas'
import { handleWorkerMessage } from '@/shared/handleWorkerMessage'
import { EToolsWorker, ToolsWorkerMessage } from '@workers/speedTools'
import { useEffect, useRef, useState } from 'react'

import PixelStore from '../store/pixel.store'
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

  const toolWorker = useRef<Worker | null>(null)

  useEffect(() => {
    toolWorker.current = new Worker('/workers/speedTools.js', { type: 'module' })
    return () => toolWorker.current?.terminate()
  }, [])

  // Eraser: (ctx: CanvasRenderingContext2D, x: number, y: number) =>
  // HandleDeletePixel({ ctx, x, y, pixelSize, xMirror, yMirror }),

  const handleUtilTools = {
    Bucket: (ctx: CanvasRenderingContext2D, x: number, y: number) => handlePaintBucket(ctx, x, y, pixelColor),
    Pipette: (ctx: CanvasRenderingContext2D, x: number, y: number) => {
      const color = handlePipetteColor(ctx, x, y)
      setPixelColor(color.rgba)
      setSelectedTool('Brush')
    }
  }

  const executeTools = async (props: THandleExecuteTools) => {
    ctx = props.ctx
    startX = alignCord(props.startX, pixelSize)
    startY = alignCord(props.startY, pixelSize)
    endX = alignCord(props.endX, pixelSize)
    endY = alignCord(props.endY, pixelSize)
    width = ctx.canvas.width
    height = ctx.canvas.height

    if (selectedTool in handleUtilTools) {
      return await handleUtilityTools()
    }

    const points = interpolateDrawing({ startX, startY, endX, endY, pixelSize })

    points.forEach(point => {
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
    })
  }

  const handleUtilityTools = async () => {
    if (!toolWorker.current) return
    // const handleTool = handleUtilTools[selectedTool as keyof typeof handleUtilTools]
    // handleTool(ctx, endX, endY)

    try {
      const bitmap = await createImageBitmap(ctx.canvas)
      if (!bitmap) return
      const message: ToolsWorkerMessage = {
        action: EToolsWorker.BUCKET,
        bitmap,
        startX,
        startY,
        fillColor: pixelColor
      }
      toolWorker.current.postMessage(message, [bitmap])
      handleWorkerMessage(toolWorker.current, data => {
        console.log('data', data)
        ctx.clearRect(0, 0, width, height)
      })
    } catch (error) {
      console.error('Failed to create ImageBitmap for layer view:', error)
    }
  }

  return { executeTools }
}

export default useTools
