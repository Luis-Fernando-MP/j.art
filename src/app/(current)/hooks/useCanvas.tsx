'use client'

import boardStore from '@/shared/components/Board/board.store'
import { IShapeBresenham, alignCord } from '@scripts/bresenham'
import {
  HandleDeletePixel,
  getCanvasCoordinates,
  handleDrawPixel,
  handlePaintBucket,
  handlePipetteColor
} from '@scripts/toolsCanvas'
import { getContext } from '@scripts/transformCanvas'
import { EWorkerActions, WorkerMessage } from '@workers/layer-view'
import { MouseEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { TPositions } from '../store/canvas.store'
import LayerStore from '../store/layer.store'
import PixelStore from '../store/pixel.store'
import ToolsStore from '../store/tools.store'
import { ShapeTools, handleBresenhamTools, shapeTools } from '../store/tools.types'

type TUseCanvas = { canvasId: string }

const useCanvas = ({ canvasId }: TUseCanvas) => {
  const { scale } = boardStore()
  const $canvasRef = useRef<HTMLCanvasElement>(null)
  const $perfectShape = useRef(false)

  const [isDrawing, setIsDrawing] = useState(false)
  const startPos = useRef<TPositions | null>(null)
  const canvasSnapshot = useRef<ImageData | null>(null)

  const { pixelColor, pixelOpacity, pixelSize, setPixelColor } = PixelStore()
  const { selectedTool, xMirror, yMirror } = ToolsStore()
  const { activeLayer, listOfLayers, setListOfLayers, idParentLayer } = LayerStore()

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
    [pixelColor, pixelSize, pixelOpacity, xMirror, yMirror, scale]
  )

  const handleCanvasMouseDown = (e: MouseEvent) => {
    if (e.ctrlKey) return
    e.preventDefault()
    const { x, y } = getCanvasCoordinates(e, canvasId)
    startPos.current = { x, y }
    handleDrawing(x, y)
    setIsDrawing(true)
    if (!(selectedTool in shapeTools) || canvasSnapshot.current) return
    const { ctx } = getContext(canvasId)
    canvasSnapshot.current = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height)
  }

  const handleCanvasMouseMove = (e: MouseEvent) => {
    if (!isDrawing) return
    activatePerfectShape(e.shiftKey)
    const { x, y } = getCanvasCoordinates(e, canvasId)
    handleDrawing(x, y)
  }

  const firstWorkerRef = useRef<Worker | null>(null)
  const secondWorkerRef = useRef<Worker | null>(null)

  useEffect(() => {
    if (!$canvasRef.current) return
    firstWorkerRef.current = new Worker('/workers/layer-view.js', { type: 'module' })
    secondWorkerRef.current = new Worker('/workers/layer-view.js', { type: 'module' })

    return () => {
      firstWorkerRef.current?.terminate()
      firstWorkerRef.current = null
      secondWorkerRef.current?.terminate()
      secondWorkerRef.current = null
    }
  }, [])

  const drawImageInLayerView = useCallback(
    (image: string | null) => {
      const updatedLayers = { ...listOfLayers }
      const parentLayers = updatedLayers[activeLayer.parentId]
      if (!parentLayers) return
      updatedLayers[activeLayer.parentId] = parentLayers.map(layer =>
        layer.id === activeLayer.id ? { ...layer, imageUrl: image } : layer
      )
      setListOfLayers(updatedLayers)
    },
    [activeLayer, listOfLayers]
  )

  const drawImageInFrameView = useCallback(
    (image: string | null) => {
      const frameID = `${idParentLayer.id}-frame-view`
      const $imageFrame = document.getElementById(frameID)
      if (!($imageFrame instanceof HTMLImageElement) || !image) return
      $imageFrame.src = image
    },
    [idParentLayer]
  )

  const bitmapFrameView = async () => {
    if (!secondWorkerRef.current) return
    const parentElement = document.getElementById(idParentLayer.id)
    if (!(parentElement instanceof HTMLElement)) return
    const listOfCanvas = parentElement.querySelectorAll('canvas')

    try {
      const imagesBitmap = await Promise.all(Array.from(listOfCanvas).map(canvas => createImageBitmap(canvas)))
      const message: WorkerMessage = { imagesBitmap, action: EWorkerActions.GENERATE_FULL_VIEW }
      secondWorkerRef.current.postMessage(message, imagesBitmap)
      secondWorkerRef.current.onmessage = event => {
        console.log('frame responde', event.data.base64)
        drawImageInFrameView(event.data.base64)
      }
      secondWorkerRef.current.onerror = error => {
        console.error('Worker Error:', error)
      }
    } catch (error) {
      console.error('Failed to create ImageBitmap:', error)
    }
  }

  const bitmapLayerView = async () => {
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
  }

  const handleCanvasMouseUp = async () => {
    setIsDrawing(false)
    startPos.current = null
    canvasSnapshot.current = null
    activatePerfectShape(false)

    await bitmapLayerView()
    await bitmapFrameView()

    // try {
    //   // Crear un ImageBitmap directamente desde el canvas
    //   const imageBitmap = await createImageBitmap(canvas)

    //   // Crear un OffscreenCanvas con las dimensiones de la imagen
    //   const offscreen = new OffscreenCanvas(imageBitmap.width, imageBitmap.height)
    //   const ctx = offscreen.getContext('2d')

    //   if (!ctx) {
    //     console.error('No se pudo obtener el contexto 2D')
    //     return null
    //   }

    //   // Dibujar la imagen en el OffscreenCanvas
    //   ctx.drawImage(imageBitmap, 0, 0)

    //   // Convertir a Blob
    //   const blob = await offscreen.convertToBlob()

    //   // Convertir Blob a Base64 usando FileReader
    //   const reader = new FileReader()
    //   reader.onloadend = () => {
    //     console.log('result', reader.result)
    //   }
    //   reader.readAsDataURL(blob)
    // } catch (error) {
    //   console.error('Error al convertir canvas a Base64:', error)
    //   return null
    // }

    // workerRef.current.postMessage({ layerView: cloneLayerView, action: 'generateFrameView' }, [cloneLayerView])

    // workerRef.current.onerror = error => {
    //   console.error('Worker error:', error)
    // }

    // -------- const imageData = originalCtx.getImageData(0, 0, 1, 1)
    // const hasContent = imageData.data.some(channel => channel !== 0)
    // if (!hasContent) {
    //   console.warn('Canvas is empty.  Ensure drawing is complete before capturing.')
    //   return
    // }
    // const cloneLayerView = canvas.cloneNode(true) as HTMLCanvasElement // Clone with deep copy for elements
    // const offscreenCanvas = new OffscreenCanvas(cloneLayerView.width, cloneLayerView.height)
    // const ctx = offscreenCanvas.getContext('2d')
    // if (!ctx) return

    // ctx.drawImage(cloneLayerView, 0, 0) // Draw the cloned canvas

    // offscreenCanvas.convertToBlob().then(blob => {
    //   const reader = new FileReader()
    //   reader.onloadend = function () {
    //     console.log('reader.result', reader.result)
    //     // Now you have the base64 data URL
    //     const base64String = reader.result
    //     // ... use base64String ...
    //   }
    //   reader.readAsDataURL(blob)
    // ------- })

    // const { canvas: fraCanvas, ctx: fraCtx } = getContext(`${canvasId}-frame-action`)
    // fraCtx.clearRect(0, 0, fraCanvas.width, fraCanvas.height)

    // const scaleX = fraCanvas.width / orCanvas.width
    // const scaleY = fraCanvas.height / orCanvas.height

    // const scale = Math.max(scaleX, scaleY)
    // const scaledWidth = orCanvas.width * scale
    // const scaledHeight = orCanvas.height * scale
    // fraCtx.drawImage(orCanvas, 0, 0, orCanvas.width, orCanvas.height, 0, 0, scaledWidth, scaledHeight)
  }

  const handleDrawing = (x: number, y: number) => {
    ;('')
    const { ctx } = getContext(canvasId)
    const endX = alignCord(x, pixelSize)
    const endY = alignCord(y, pixelSize)

    const { width, height } = ctx.canvas
    const mirroredX = width - x - pixelSize
    const mirroredY = height - y - pixelSize

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
  const handleCanvasMouseLeave = (e: MouseEvent) => {
    if (e.ctrlKey) return
    // handleCanvasMouseUp()
  }

  return {
    $canvasRef,
    handleCanvasMouseDown,
    handleCanvasMouseMove,
    handleCanvasMouseUp,
    handleCanvasMouseLeave
  }
}

export default useCanvas
