'use client'

import { getCanvasCoordinates } from '@scripts/toolsCanvas'
import { getContext } from '@scripts/transformCanvas'
import { MouseEvent, useEffect, useRef, useState } from 'react'

import { TPositions } from '../store/canvas.store'
import RepaintDrawingStore from '../store/repaintDrawing.store'
import useTools from './useTools'

type TUseCanvas = { canvasId: string }

const useCanvas = ({ canvasId }: TUseCanvas) => {
  // const { scale } = boardStore()
  const $canvasRef = useRef<HTMLCanvasElement>(null)
  const $perfectShape = useRef(false)

  const [isDrawing, setIsDrawing] = useState(false)
  const startPos = useRef<TPositions | null>(null)
  const canvasSnapshot = useRef<ImageData | null>(null)
  const { setRepaint } = RepaintDrawingStore()

  const { executeTools } = useTools()

  const activatePerfectShape = (isActive: boolean) => {
    $perfectShape.current = isActive
  }

  const handleCanvasMouseDown = async (e: MouseEvent) => {
    if (e.ctrlKey) return
    const coordinates = getCanvasCoordinates(e, canvasId)
    if (!coordinates) return
    setIsDrawing(true)
    startPos.current = coordinates
    await handleDrawing(coordinates.x, coordinates.y)
    // if (!(selectedTool in shapeTools) || canvasSnapshot.current) return
    // const { ctx } = getContext(canvasId)
    // canvasSnapshot.current = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height)
  }

  const handleCanvasMouseMove = (e: MouseEvent) => {
    if (!isDrawing) return
    requestAnimationFrame(async () => {
      const coordinates = getCanvasCoordinates(e, canvasId)
      if (!coordinates) return
      activatePerfectShape(e.shiftKey)
      await handleDrawing(coordinates.x, coordinates.y)
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

  const handleDrawing = async (x: number, y: number) => {
    if (!startPos.current) return
    const existCanvas = getContext(canvasId)
    if (!existCanvas) return

    await executeTools({ ctx: existCanvas.ctx, startX: startPos.current.x, startY: startPos.current.y, endX: x, endY: y })

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
