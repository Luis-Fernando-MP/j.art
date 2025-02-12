import { EWorkerActions, WorkerMessage } from '@workers/layer-view'
import { useLayoutEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'

import LayerStore from '../store/layer.store'

type UpdateSelectedLayer = { index: number; layerId: string }

const useMergeTool = () => {
  const { listOfLayers, idParentLayer, updateLayer } = LayerStore()
  const currentLayers = listOfLayers[idParentLayer.id]
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
    console.log('from', firstLayer.slice(0, 7), 'to', secondLayer.slice(0, 7))
    const validate = currentLayers.some(layer => layer.id === firstLayer) || currentLayers.some(layer => layer.id === secondLayer)
    if (!validate || firstLayer === secondLayer) return toast.error('❗️Asegúrate de elegir bien las capas')
    const $firstCanvas = document.getElementById(firstLayer) as HTMLCanvasElement
    const $secondCanvas = document.getElementById(secondLayer) as HTMLCanvasElement
    if (!$firstCanvas || !$secondCanvas) return toast.error('❗️No se encontraron los lienzos')
    const canvasCtx = $firstCanvas.getContext('2d')
    if (!canvasCtx) return

    try {
      const imagesBitmap = await Promise.all([createImageBitmap($secondCanvas), createImageBitmap($firstCanvas)])
      const message: WorkerMessage = { imagesBitmap, action: EWorkerActions.GENERATE_FULL_VIEW }
      mergeWorker.current.postMessage(message, imagesBitmap)

      mergeWorker.current.onmessage = event => {
        const { base64, mergedBitmap } = event.data
        if (!base64 || !mergedBitmap) return
        const updatedLayers = currentLayers.filter(layer => layer.id !== secondLayer)
        canvasCtx.clearRect(0, 0, $firstCanvas.width, $firstCanvas.height)
        canvasCtx.drawImage(mergedBitmap, 0, 0, $firstCanvas.width, $firstCanvas.height)
        updateLayer({
          parentId: idParentLayer.id,
          layer: { id: firstLayer, imageUrl: base64 },
          list: updatedLayers
        })
        toast.success('🍀 Fusionado')
      }

      mergeWorker.current.onerror = () => toast.error('❗️Error al procesar la fusión')
    } catch (error) {
      console.error(error)
    }
  }

  return { currentLayers, handleMergeLayers, updateSelectedLayer }
}

export default useMergeTool
