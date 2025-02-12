import { newKey } from '@/shared/key'
import { CopyIcon } from 'lucide-react'
import type { JSX } from 'react'
import toast from 'react-hot-toast'

import LayerStore from '../../store/layer.store'

const CopyLayer = (): JSX.Element => {
  const { activeLayer, listOfLayers, setListOfLayers } = LayerStore()

  const handleClick = () => {
    if (!activeLayer) return toast.error('❗️No hay capa activa seleccionada')
    const { id, parentId } = activeLayer
    const layers = listOfLayers[parentId]
    if (!Array.isArray(layers)) return
    const $parentCanvas = document.getElementById(parentId)
    if (!($parentCanvas instanceof HTMLElement)) return
    const currentLayerIndex = layers.findIndex(l => l.id === id)
    if (currentLayerIndex === -1) return toast.error('❗️No se encontró la capa')
    const $currentCanvas = document.getElementById(id)
    if (!($currentCanvas instanceof HTMLCanvasElement)) return toast.error('❗️Parece que el lienzo no existe')
    const selectedLayer = layers[currentLayerIndex]
    const newLayerKey = newKey()
    const newLayer = {
      ...selectedLayer,
      id: newLayerKey,
      title: `copia-${selectedLayer.title}`
    }
    const updatedLayers = [...layers]
    updatedLayers.splice(currentLayerIndex + 1, 0, newLayer)
    setListOfLayers({ ...listOfLayers, [parentId]: [...updatedLayers] })
    const timeout = setTimeout(() => {
      const $clonCanvas = document.getElementById(newLayerKey)
      if (!($clonCanvas instanceof HTMLCanvasElement)) return toast.error('❗️No se pudo clonar el lienzo')
      const ctx = $clonCanvas.getContext('2d')
      if (!ctx) return
      ctx.drawImage($currentCanvas, 0, 0)
      clearTimeout(timeout)
      toast.success('🔱 Todo listo')
    }, 100)
  }

  return (
    <button onClick={handleClick}>
      <CopyIcon />
    </button>
  )
}

export default CopyLayer
