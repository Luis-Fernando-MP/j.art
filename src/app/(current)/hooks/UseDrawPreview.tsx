import { getBitmapFromCanvas, getBitmapFromParentCanvas } from '@/shared/bitmap'
import { handleWorkerMessage } from '@/shared/handleWorkerMessage'
import { EWorkerActions, WorkerMessage } from '@workers/layer-view'
import { RefObject, useCallback, useEffect, useRef } from 'react'
import toast from 'react-hot-toast'

import ActiveDrawsStore from '../store/ActiveDraws.store'
import LayerStore from '../store/layer.store'
import RepaintDrawingStore, { Repaint } from '../store/repaintDrawing.store'

interface IUseDrawPreviewHook {
  $canvasRef: RefObject<HTMLCanvasElement | null>
}

let temporalRepaintValue: Repaint | null

const useDrawPreview = ({ $canvasRef }: IUseDrawPreviewHook) => {
  const { actParentId, actLayerId } = ActiveDrawsStore()
  const { repaint, setRepaint } = RepaintDrawingStore()
  const { listOfLayers, setListOfLayers } = LayerStore()

  const frameWorker = useRef<Worker | null>(null)
  const layerWorker = useRef<Worker | null>(null)

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
      if (!image || !temporalRepaintValue) return

      if ($imageFrame instanceof HTMLImageElement && ['slider', 'frames', 'all'].includes(temporalRepaintValue))
        $imageFrame.src = image
      if ($viewerFrame instanceof HTMLImageElement && ['zoom', 'frames', 'all'].includes(temporalRepaintValue))
        $viewerFrame.src = image

      temporalRepaintValue = null
    },
    [actParentId]
  )

  const generateFrameViewBitmap = useCallback(async () => {
    if (!frameWorker.current) return
    try {
      const imagesBitmap = await getBitmapFromParentCanvas(actParentId)
      if (!imagesBitmap) throw new Error('Failed to load canvas bitmap')
      const message: WorkerMessage = { imagesBitmap, action: EWorkerActions.GENERATE_FULL_VIEW }
      frameWorker.current.postMessage(message, imagesBitmap)
      handleWorkerMessage(frameWorker.current, data => drawImageInFrameView(data.base64))
    } catch (error) {
      console.error('Failed to create ImageBitmap for frame view:', error)
    }
  }, [actParentId, drawImageInFrameView, listOfLayers])

  const generateLayerViewBitmap = useCallback(async () => {
    if (!layerWorker.current) return
    const imageBitmap = await getBitmapFromCanvas(actLayerId)
    if (!imageBitmap) return
    try {
      const message: WorkerMessage = { imageBitmap, action: EWorkerActions.GENERATE_FRAME }
      layerWorker.current.postMessage(message, [imageBitmap])
      handleWorkerMessage(layerWorker.current, data => drawImageInLayerView(data.base64))
    } catch (error) {
      console.error('Failed to create ImageBitmap for layer view:', error)
    }
  }, [actLayerId, drawImageInLayerView])

  useEffect(() => {
    if (!repaint || !$canvasRef.current) return
    const handleRepaint = async () => {
      temporalRepaintValue = repaint
      if (['frames', 'zoom', 'slider'].includes(repaint)) await generateFrameViewBitmap()
      if (repaint === 'layers') await generateLayerViewBitmap()
      if (repaint === 'all') await Promise.all([generateFrameViewBitmap(), generateLayerViewBitmap()])
      setRepaint(null)
    }
    handleRepaint()
  }, [repaint, generateFrameViewBitmap, generateLayerViewBitmap, setRepaint])

  useEffect(() => {
    if (!$canvasRef.current) return
    frameWorker.current = new Worker('/workers/layer-view.js', { type: 'module' })
    layerWorker.current = new Worker('/workers/layer-view.js', { type: 'module' })

    return () => {
      frameWorker.current?.terminate()
      layerWorker.current?.terminate()
    }
  }, [$canvasRef])
}

export default useDrawPreview
