'use client'

import { getBitmapFromCanvasList } from '@/shared/bitmap'
import { IShapeBresenham, alignCord, bresenham } from '@scripts/bresenham'
import {
  HandleDeletePixel,
  getCanvasCoordinates,
  handleDrawPixel,
  handlePaintBucket,
  handlePipetteColor,
  interpolateBresenham,
  interpolatePoints
} from '@scripts/toolsCanvas'
import { getContext } from '@scripts/transformCanvas'
import { EWorkerActions, WorkerMessage } from '@workers/layer-view'
import { MouseEvent, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'

import ActiveDrawsStore from '../store/ActiveDraws.store'
import { TPositions } from '../store/canvas.store'
import PixelStore from '../store/pixel.store'
import RepaintDrawingStore from '../store/repaintDrawing.store'
import ToolsStore from '../store/tools.store'
import { ShapeTools, handleBresenhamTools, shapeTools } from '../store/tools.types'

type TUseCanvas = { canvasId: string }

const useCanvas = ({ canvasId }: TUseCanvas) => {
  // const { scale } = boardStore()
  const $canvasRef = useRef<HTMLCanvasElement>(null)
  const $perfectShape = useRef(false)

  const [isDrawing, setIsDrawing] = useState(false)
  const startPos = useRef<TPositions | null>(null)
  const endPos = useRef<TPositions | null>(null)
  const canvasSnapshot = useRef<ImageData | null>(null)

  const { pixelColor, pixelOpacity, pixelSize, setPixelColor } = PixelStore()
  const { selectedTool, xMirror, yMirror } = ToolsStore()
  // const { activeLayer, listOfLayers, setListOfLayers, idParentLayer } = LayerStore()
  // const { listOfLayers } = LayerStore()

  const { actParentId, actLayerId } = ActiveDrawsStore()

  const { repaint, setRepaint } = RepaintDrawingStore()

  const firstWorkerRef = useRef<Worker | null>(null)
  const secondWorkerRef = useRef<Worker | null>(null)

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

  const drawImageInLayerView = useCallback(
    (image: string | null) => {
      // console.log('in id', actLayerId.slice(0, 5), 'image', image)
      // const updatedLayers = { ...listOfLayers }
      // const parentLayers = updatedLayers[activeLayer.parentId]
      // if (!parentLayers) return
      // updatedLayers[activeLayer.parentId] = parentLayers.map(layer =>
      //   layer.id === actLayerId ? { ...layer, imageUrl: image } : layer
      // )
      // setListOfLayers(updatedLayers)
    },
    [actLayerId]
  )

  const drawImageInFrameView = useCallback(
    (image: string | null) => {
      const frameID = `${actParentId}-frame-view`
      const $imageFrame = document.getElementById(frameID)
      const $viewerFrame = document.getElementById('viewer-frame')
      if (!image) return
      if ($imageFrame instanceof HTMLImageElement) $imageFrame.src = image
      if ($viewerFrame instanceof HTMLImageElement) $viewerFrame.src = image
    },
    [actParentId]
  )

  const bitmapFrameView = useCallback(async () => {
    if (!secondWorkerRef.current) return
    try {
      const imagesBitmap = await getBitmapFromCanvasList(actParentId)
      if (!imagesBitmap) throw new Error('fail to load canvas bitmap')
      const message: WorkerMessage = { imagesBitmap, action: EWorkerActions.GENERATE_FULL_VIEW }
      secondWorkerRef.current.postMessage(message, imagesBitmap)
      secondWorkerRef.current.onmessage = event => {
        drawImageInFrameView(event.data.base64)
      }
      secondWorkerRef.current.onerror = error => {
        console.error('Worker Error:', error)
      }
    } catch (error) {
      console.error('Failed to create ImageBitmap:', error)
    }
  }, [actParentId, drawImageInFrameView])

  const bitmapLayerView = useCallback(async () => {
    if (!firstWorkerRef.current) return
    const { canvas } = getContext(canvasId)
    try {
      const imageBitmap = await createImageBitmap(canvas)
      const message: WorkerMessage = { imageBitmap, action: EWorkerActions.GENERATE_FRAME }
      firstWorkerRef.current.postMessage(message, [imageBitmap])
      firstWorkerRef.current.onmessage = event => {
        drawImageInLayerView(event.data.base64)
      }
      firstWorkerRef.current.onerror = error => {
        console.error('Worker Error:', error)
      }
    } catch (error) {
      console.error('Failed to create ImageBitmap:', error)
    }
  }, [canvasId, drawImageInLayerView])

  const handleCanvasMouseUp = async () => {
    setIsDrawing(false)
    startPos.current = null
    endPos.current = null
    canvasSnapshot.current = null
    activatePerfectShape(false)
    await bitmapLayerView()
    await bitmapFrameView()
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

  useEffect(() => {
    if (!$canvasRef.current) return
    firstWorkerRef.current = new Worker('/workers/layer-view.js', { type: 'module' })
    secondWorkerRef.current = new Worker('/workers/layer-view.js', { type: 'module' })

    return () => {
      firstWorkerRef.current?.terminate()
      secondWorkerRef.current?.terminate()
    }
  }, [])

  useLayoutEffect(() => {
    if (!repaint || !$canvasRef.current) return

    const handleRepaint = async () => {
      if (repaint === 'frames') await bitmapFrameView()
      if (repaint === 'layers') await bitmapLayerView()
      if (repaint === 'all') await Promise.all([bitmapFrameView(), bitmapLayerView()])

      setRepaint(null)
    }

    handleRepaint()
  }, [repaint, bitmapFrameView, bitmapLayerView, setRepaint])

  return {
    $canvasRef,
    handleCanvasMouseDown,
    handleCanvasMouseMove
  }
}

export default useCanvas
