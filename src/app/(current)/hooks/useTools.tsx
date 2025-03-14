import { alignCord } from '@/scripts/bresenham'
import {
  HandleDeletePixel,
  handleDither,
  handleDrawPixel,
  handleInvertDrawPixel,
  moveDraw,
  moveFrameDraw
} from '@/scripts/toolsCanvas'
import { handleWorkerMessage } from '@/shared/handleWorkerMessage'
import { EToolsWorker, ToolsWorkerMessage } from '@workers/speedTools/speedTools.types'
import { useCallback, useEffect, useRef } from 'react'

import ActiveDrawsStore from '../store/ActiveDraws.store'
import { TPositions } from '../store/canvas.store'
import PixelStore from '../store/pixel.store'
import RepaintDrawingStore from '../store/repaintDrawing.store'
import SelectionStore from '../store/selection.store'
import ToolsStore from '../store/tools.store'

type THandleExecuteTools = {
  ctx: CanvasRenderingContext2D
  startX: number
  startY: number
  endX: number
  endY: number
}

type HandleSelectProps = {
  ctx: CanvasRenderingContext2D
  x: number
  y: number
}

const useTools = () => {
  const { selectedTool, xMirror, yMirror, setSelectedTool } = ToolsStore()
  const { pixelColor, pixelOpacity, pixelSize, setPixelColor } = PixelStore()
  const { actParentId } = ActiveDrawsStore()
  const { setSelection, selection } = SelectionStore()
  const mvSelection = useRef<TPositions | null>(null)
  const isDrawingSelectSquare = useRef(false)
  const toolWorker = useRef<Worker | null>(null)
  const $selection = useRef<HTMLElement | null>(null)
  const { setRepaint } = RepaintDrawingStore()
  const isMovingSelection = useRef(false)

  const isWithinSelection = (x: number, y: number) => {
    if (!$selection.current || !selection) return false
    const { startX, startY, endX, endY } = selection
    const parseX = alignCord(x, pixelSize)
    const parseY = alignCord(y, pixelSize)
    return parseX >= startX && parseX <= endX && parseY >= startY && parseY <= endY
  }

  const handleDown = useCallback(
    (props: HandleSelectProps) => {
      if (selectedTool !== 'SelectSquare') return
      if (!$selection.current) $selection.current = document.getElementById('selection') as HTMLElement

      const { x, y } = props

      $selection.current.classList.remove('show')

      const startX = alignCord(x, pixelSize)
      const startY = alignCord(y, pixelSize)

      setSelection({ startX, startY })
      mvSelection.current = { x: startX, y: startY }
      isDrawingSelectSquare.current = true

      $selection.current.style.left = `${startX}px`
      $selection.current.style.top = `${startY}px`
    },
    [selectedTool, pixelSize, setSelection, selection]
  )

  const moveSelection = useCallback((x: number, y: number) => {
    if (isWithinSelection(x, y)) {
      console.log('isWithinSelection')
      isMovingSelection.current = true
      moveSelection(x, y)
      return
    }

    if (!mvSelection.current || !$selection.current) return
    const deltaX = x - mvSelection.current.x
    const deltaY = y - mvSelection.current.y

    mvSelection.current.x = x
    mvSelection.current.y = y

    $selection.current.style.left = `${mvSelection.current.x}px`
    $selection.current.style.top = `${mvSelection.current.y}px`

    console.log('moveSelection', deltaX, deltaY)
  }, [])

  const handleSelectSquare = useCallback(
    (props: HandleSelectProps) => {
      if (!$selection.current || !isDrawingSelectSquare.current || !mvSelection.current) return
      if (isMovingSelection.current) return

      const { x, y } = props
      const width = Math.abs(x - mvSelection.current.x) + pixelSize
      const height = Math.abs(y - mvSelection.current.y) + pixelSize
      const left = Math.min(mvSelection.current.x, x)
      const top = Math.min(mvSelection.current.y, y)

      setSelection({ endX: x, endY: y, width, height })

      $selection.current.style.left = `${left}px`
      $selection.current.style.top = `${top}px`
      $selection.current.style.width = `${width}px`
      $selection.current.style.height = `${height}px`
    },
    [pixelSize, setSelection]
  )

  const handleToolUp = useCallback(() => {
    if (selectedTool !== 'SelectSquare') return
    $selection.current?.classList.add('show')
    if (!isDrawingSelectSquare.current || !mvSelection.current) return

    isDrawingSelectSquare.current = false
    isMovingSelection.current = false
    mvSelection.current = null
  }, [selectedTool])

  const executeTools = async (props: THandleExecuteTools) => {
    if (selectedTool === 'Cursor') return
    const ctx = props.ctx
    const startX = alignCord(props.startX, pixelSize)
    const startY = alignCord(props.startY, pixelSize)
    const endX = alignCord(props.endX, pixelSize)
    const endY = alignCord(props.endY, pixelSize)

    const toolHandlers = {
      Move: () => moveDraw(ctx, endX - startX, endY - startY),
      Hand: () => moveFrameDraw(actParentId, endX - startX, endY - startY),
      Brush: () => handleDrawPixel({ ctx, x: endX, y: endY, pixelColor, pixelSize, pixelOpacity, xMirror, yMirror }),
      PerfectPixel: () => handleDrawPixel({ ctx, x: endX, y: endY, pixelColor, pixelSize, pixelOpacity, xMirror, yMirror }),
      InvertBrush: () => handleInvertDrawPixel({ ctx, x: endX, y: endY, pixelColor, pixelSize, pixelOpacity, xMirror, yMirror }),
      Dithering: () => handleDither({ ctx, x: endX, y: endY, pixelColor, pixelSize, pixelOpacity, xMirror, yMirror }),
      Eraser: () => HandleDeletePixel({ ctx, pixelSize, x: endX, y: endY, xMirror, yMirror }),
      SelectSquare: () => handleSelectSquare({ ctx, x: endX, y: endY }),
      Bucket: async () => {
        const bitmap = await createImageBitmap(ctx.canvas)
        if (!bitmap) return
        const message: ToolsWorkerMessage = { action: EToolsWorker.BUCKET, bitmap, startX, startY, fillColor: pixelColor }
        toolWorker.current?.postMessage(message, [bitmap])
        paintRenderCanvas(ctx, ctx.canvas.width, ctx.canvas.height)
      },
      Pipette: async () => {
        const bitmap = await createImageBitmap(ctx.canvas)
        if (!bitmap) return
        const message: ToolsWorkerMessage = { action: EToolsWorker.PIPETTE, bitmap, startX, startY }
        toolWorker.current?.postMessage(message, [bitmap])
        paintRenderCanvas(ctx, ctx.canvas.width, ctx.canvas.height)
      }
    }
    if (selectedTool in toolHandlers) {
      await toolHandlers[selectedTool as keyof typeof toolHandlers]()
    }
  }

  const paintRenderCanvas = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
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

  useEffect(() => {
    toolWorker.current = new Worker(/* turbopackIgnore: true */ '/workers/speedTools/index.js', { type: 'module' })
    return () => toolWorker.current?.terminate()
  }, [])

  return { executeTools, handleDown, handleToolUp }
}

export default useTools
