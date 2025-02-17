import { getContext } from '@/scripts/transformCanvas'
import { getBitmapFromCanvasList } from '@/shared/bitmap'
import { EWorkerActions, WorkerMessage } from '@workers/layer-view'
import { RefObject, useCallback, useEffect, useRef } from 'react'
import toast from 'react-hot-toast'

import ActiveDrawsStore from '../store/ActiveDraws.store'
import LayerStore from '../store/layer.store'
import RepaintDrawingStore from '../store/repaintDrawing.store'

interface IUseDrawPreviewHook {
  $canvasRef: RefObject<HTMLCanvasElement | null>
}

const useDrawPreview = ({ $canvasRef }: IUseDrawPreviewHook) => {
  const { actParentId, actLayerId } = ActiveDrawsStore()
  const { repaint, setRepaint } = RepaintDrawingStore()
  const { listOfLayers, setListOfLayers } = LayerStore()

  const frameWorkerRef = useRef<Worker | null>(null)
  const layerWorkerRef = useRef<Worker | null>(null)

  const drawImageInLayerView = useCallback(
    (image: string | null) => {
      const updatedLayers = structuredClone(listOfLayers)
      const parentLayers = updatedLayers[actParentId]
      if (!parentLayers) return
      const currentIndexLayer = parentLayers.findIndex(l => l.id === actLayerId)
      if (currentIndexLayer < 0) return toast.error('🙂 No encontramos el lienzo seleccionado')
      let currentLayer = updatedLayers[actParentId][currentIndexLayer]
      updatedLayers[actParentId][currentIndexLayer] = { ...currentLayer, imageUrl: image }
      setListOfLayers({ ...updatedLayers, [actParentId]: parentLayers })
    },
    [actLayerId, listOfLayers, actParentId, setListOfLayers]
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

  const handleWorkerMessage = (workerRef: RefObject<Worker | null>, callback: (data: any) => void) => {
    if (!workerRef.current) return
    workerRef.current.onmessage = event => callback(event.data)
    workerRef.current.onerror = error => console.error('Worker Error:', error)
  }

  const generateFrameViewBitmap = useCallback(async () => {
    if (!frameWorkerRef.current) return
    try {
      const imagesBitmap = await getBitmapFromCanvasList(actParentId)
      if (!imagesBitmap) throw new Error('Failed to load canvas bitmap')
      const message: WorkerMessage = { imagesBitmap, action: EWorkerActions.GENERATE_FULL_VIEW }
      frameWorkerRef.current.postMessage(message, imagesBitmap)
      handleWorkerMessage(frameWorkerRef, data => drawImageInFrameView(data.base64))
    } catch (error) {
      console.error('Failed to create ImageBitmap for frame view:', error)
    }
  }, [actParentId, drawImageInFrameView])

  const generateLayerViewBitmap = useCallback(async () => {
    if (!layerWorkerRef.current) return
    const { canvas } = getContext(actLayerId)
    try {
      const imageBitmap = await createImageBitmap(canvas)
      const message: WorkerMessage = { imageBitmap, action: EWorkerActions.GENERATE_FRAME }
      layerWorkerRef.current.postMessage(message, [imageBitmap])
      handleWorkerMessage(layerWorkerRef, data => drawImageInLayerView(data.base64))
    } catch (error) {
      console.error('Failed to create ImageBitmap for layer view:', error)
    }
  }, [actLayerId, drawImageInLayerView])

  useEffect(() => {
    if (!repaint || !$canvasRef.current) return
    const handleRepaint = async () => {
      if (repaint === 'frames') await generateFrameViewBitmap()
      if (repaint === 'layers') await generateLayerViewBitmap()
      if (repaint === 'all') await Promise.all([generateFrameViewBitmap(), generateLayerViewBitmap()])
      setRepaint(null)
    }
    handleRepaint()
  }, [repaint, generateFrameViewBitmap, generateLayerViewBitmap, setRepaint])

  useEffect(() => {
    if (!$canvasRef.current) return
    frameWorkerRef.current = new Worker('/workers/layer-view.js', { type: 'module' })
    layerWorkerRef.current = new Worker('/workers/layer-view.js', { type: 'module' })

    return () => {
      frameWorkerRef.current?.terminate()
      layerWorkerRef.current?.terminate()
    }
  }, [$canvasRef])
}

export default useDrawPreview
