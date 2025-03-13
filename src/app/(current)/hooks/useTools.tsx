import { alignCord } from '@/scripts/bresenham'
import {
  HandleDeletePixel,
  handleDither,
  handleDrawPixel,
  handleInvertDrawPixel,
  interpolateDrawing,
  moveDraw,
  moveFrameDraw
} from '@/scripts/toolsCanvas'
import { handleWorkerMessage } from '@/shared/handleWorkerMessage'
import { EToolsWorker, ToolsWorkerMessage } from '@workers/speedTools/speedTools.types'
import { useEffect, useRef, useState } from 'react'

import ActiveDrawsStore from '../store/ActiveDraws.store'
import { TPositions } from '../store/canvas.store'
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

type THandleDown = {
  ctx: CanvasRenderingContext2D
  x: number
  y: number
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
  const { actParentId } = ActiveDrawsStore()

  const mvSelection = useRef<TPositions | null>(null)
  const isDrawingSelectSquare = useRef(false)

  const toolWorker = useRef<Worker | null>(null)

  useEffect(() => {
    toolWorker.current = new Worker(/* turbopackIgnore: true */ '/workers/speedTools/index.js', { type: 'module' })
    return () => toolWorker.current?.terminate()
  }, [])

  // Eraser: (ctx: CanvasRenderingContext2D, x: number, y: number) =>
  // HandleDeletePixel({ ctx, x, y, pixelSize, xMirror, yMirror }),
  const handleDown = (props: THandleDown) => {
    if (selectedTool !== 'SelectSquare') return
    const currentFrame = document.getElementById(actParentId)
    if (!currentFrame) return

    const { x, y } = props
    const startX = alignCord(x, pixelSize)
    const startY = alignCord(y, pixelSize)

    let $selectSquare = document.getElementById('select-square')
    if (!$selectSquare) return

    $selectSquare.style.minWidth = `${pixelSize}px`
    $selectSquare.style.minHeight = `${pixelSize}px`
    $selectSquare.style.width = `${pixelSize}px`
    $selectSquare.style.height = `${pixelSize}px`

    $selectSquare.style.left = `${startX}px`
    $selectSquare.style.top = `${startY}px`

    mvSelection.current = { x: startX, y: startY }
    isDrawingSelectSquare.current = true
  }

  const handleSelectSquare = (props: THandleExecuteTools) => {
    const $selectSquare = document.getElementById('selection')
    if (!$selectSquare || !isDrawingSelectSquare.current || !mvSelection.current) return

    const { endX, endY } = props

    const width = Math.abs(endX - mvSelection.current.x) + pixelSize
    const height = Math.abs(endY - mvSelection.current.y) + pixelSize
    const left = Math.min(mvSelection.current.x, endX)
    const top = Math.min(mvSelection.current.y, endY)

    $selectSquare.style.left = `${left}px`
    $selectSquare.style.top = `${top}px`
    $selectSquare.style.width = `${width}px`
    $selectSquare.style.height = `${height}px`
  }

  const handleToolUp = () => {
    isDrawingSelectSquare.current = false
    mvSelection.current = null
  }

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
      return handleSelectTools()
    }

    if (selectedTool in drawTools) {
      return await handleUDrawTools()
    }

    if (selectedTool === 'SelectSquare') {
      return handleSelectSquare({ ctx, startX, startY, endX, endY })
    }
  }

  const handleSelectTools = () => {
    const tool = selectedTool as keyof typeof selectTools

    if (tool === 'Move') {
      moveDraw(ctx, endX - startX, endY - startY)
    }

    if (tool === 'Hand') {
      moveFrameDraw(actParentId, endX - startX, endY - startY)
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
    Move: () => {},
    Hand: () => {}
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

  return { executeTools, handleDown, handleToolUp }
}

export default useTools
