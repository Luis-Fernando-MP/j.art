import { getBitmapFromCanvas } from '@/shared/bitmap'
import { EWorkerActions, WorkerMessage } from '@workers/layer-view'
import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import toast from 'react-hot-toast'

import ActiveDrawsStore from '../store/ActiveDraws.store'
import LayerStore from '../store/layer.store'
import RepaintDrawingStore from '../store/repaintDrawing.store'

type UpdateSelectedLayer = { index: number; layerId: string }

const useMergeTool = () => {
  const { listOfLayers, updateLayer } = LayerStore()
  const { actParentId } = ActiveDrawsStore()
  const { setRepaint } = RepaintDrawingStore()
  const { setActLayerId } = ActiveDrawsStore()

  const currentLayers = useMemo(() => listOfLayers[actParentId], [listOfLayers, actParentId])
  const [selectedLayers, setSelectedLayers] = useState<string[]>([])

  const mergeWorker = useRef<Worker | null>(null)

  useLayoutEffect(() => {
    if (currentLayers.length < 1) return
    let updatedMergeLayers = [...selectedLayers]
    if (updatedMergeLayers.length < 1) updatedMergeLayers = [currentLayers[0].id, currentLayers[0].id]
    setSelectedLayers(updatedMergeLayers)
  }, [])

  useLayoutEffect(() => {
    mergeWorker.current = new Worker('/workers/layer-view.js', { type: 'module' })
    return () => mergeWorker.current?.terminate()
  }, [])

  const updateSelectedLayer = ({ index, layerId }: UpdateSelectedLayer) => {
    setSelectedLayers(prev => {
      const updatedMergeLayers = [...prev]
      updatedMergeLayers[index] = layerId
      return updatedMergeLayers
    })
  }

  const handleMergeLayers = async () => {
    if (!mergeWorker.current || selectedLayers.length < 2) return
    const [firstLayer, secondLayer] = selectedLayers
    const validate = currentLayers.some(layer => layer.id === firstLayer) || currentLayers.some(layer => layer.id === secondLayer)
    if (!validate || firstLayer === secondLayer) return toast.error('❗️Asegúrate de elegir bien las capas')

    const $firstCanvas = document.getElementById(firstLayer) as HTMLCanvasElement

    if (!$firstCanvas) return toast.error('❗️No se encontraron los lienzos')
    const canvasCtx = $firstCanvas.getContext('2d')
    if (!canvasCtx) return

    try {
      const firstBitmap = await getBitmapFromCanvas(firstLayer)
      const secondBitmap = await getBitmapFromCanvas(secondLayer)
      if (!firstBitmap || !secondBitmap) return toast.error('La transformación de los lienzos ha fallado')

      const imagesBitmap = [secondBitmap, firstBitmap]
      const message: WorkerMessage = { imagesBitmap, action: EWorkerActions.GENERATE_FULL_VIEW }
      mergeWorker.current.postMessage(message, imagesBitmap)

      mergeWorker.current.onmessage = event => {
        const { base64, mergedBitmap } = event.data
        if (!base64 || !mergedBitmap) return
        const updatedLayers = currentLayers.filter(layer => layer.id !== secondLayer)
        canvasCtx.clearRect(0, 0, $firstCanvas.width, $firstCanvas.height)
        canvasCtx.drawImage(mergedBitmap, 0, 0, $firstCanvas.width, $firstCanvas.height)
        updateLayer({
          parentId: actParentId,
          layer: { id: firstLayer, imageUrl: base64 },
          list: updatedLayers
        })
        toast.success('🍀 Fusionado')
        setRepaint('frames')
        setActLayerId(firstLayer)
      }

      mergeWorker.current.onerror = () => toast.error('❗️Error al procesar la fusión')
    } catch (error) {
      console.error(error)
    }
  }

  return { currentLayers, handleMergeLayers, updateSelectedLayer }
}

export default useMergeTool
