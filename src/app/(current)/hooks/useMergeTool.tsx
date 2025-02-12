import { EWorkerActions, WorkerMessage } from '@workers/layer-view'
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import toast from 'react-hot-toast'

import LayerStore from '../store/layer.store'

const useMergeTool = () => {
  const { listOfLayers, idParentLayer, updateLayer } = LayerStore()
  const [openPopup, setOpenPopup] = useState(false)
  const currentLayers = useMemo(() => listOfLayers[idParentLayer.id], [listOfLayers, idParentLayer])

  console.log('currentLayers', currentLayers)
  const [selectedLayers, setSelectedLayers] = useState<string[]>([])
  const mergeWorker = useRef<Worker | null>(null)

  useEffect(() => {
    if (currentLayers.length < 1) return setSelectedLayers([])
    const newSelection = [currentLayers[0]?.id, currentLayers[0]?.id]
    if (JSON.stringify(selectedLayers) === JSON.stringify(newSelection)) return
    setSelectedLayers(newSelection)
  }, [listOfLayers, idParentLayer.id])

  useLayoutEffect(() => {
    mergeWorker.current = new Worker('/workers/layer-view.js', { type: 'module' })
    return () => mergeWorker.current?.terminate()
  }, [])

  const updateSelectedLayer = (index: number, layerId: string) => {
    setSelectedLayers(prev => {
      // if (prev[index] === layerId) return prev
      const newLayers = [...prev]
      newLayers[index] = layerId
      return newLayers
    })
  }

  const handleMergeLayers = async () => {
    console.log('selectedLayers', selectedLayers)
    if (!mergeWorker.current || selectedLayers.length < 2) return
    const [firstLayer, secondLayer] = selectedLayers
    if (firstLayer === secondLayer) return toast.error('❗️Las capas deben ser diferentes')

    const firstExists = currentLayers.some(layer => layer.id === firstLayer)
    const secondExists = currentLayers.some(layer => layer.id === secondLayer)
    console.log({ firstExists, secondExists }, currentLayers, selectedLayers)
    if (!firstExists || !secondExists) {
      return toast.error('❗️Asegúrate de elegir capas válidas')
    }

    const $firstCanvas = document.getElementById(firstLayer) as HTMLCanvasElement | null
    const $secondCanvas = document.getElementById(secondLayer) as HTMLCanvasElement | null
    if (!$firstCanvas || !$secondCanvas) return toast.error('❗️No se encontraron los lienzos')

    const canvasCtx = $firstCanvas.getContext('2d')
    if (!canvasCtx) return toast.error('❗️No se pudo obtener el contexto del lienzo')

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
      }

      mergeWorker.current.onerror = error => {
        console.error('❌ Error en el Worker:', error)
        toast.error('❗️Error al procesar la fusión')
      }
    } catch (error) {
      console.error('❌ Error al crear ImageBitmap:', error)
      toast.error('❗️No se pudo procesar la fusión de capas')
    }
  }

  return { openPopup, currentLayers, selectedLayers, setOpenPopup, handleMergeLayers, updateSelectedLayer }
}

export default useMergeTool
