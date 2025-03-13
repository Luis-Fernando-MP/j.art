import { newKey } from '@/shared/key'
import { CopyIcon } from 'lucide-react'
import type { JSX } from 'react'
import toast from 'react-hot-toast'

import ActiveDrawsStore from '../../store/ActiveDraws.store'
import LayerStore from '../../store/layer.store'

const CopyLayer = (): JSX.Element => {
  const { listOfLayers, setListOfLayers } = LayerStore()
  const { actLayerId, actParentId } = ActiveDrawsStore()

  const handleClick = () => {
    if (!actLayerId) return toast.error('❗️No hay capa activa seleccionada')
    const layers = listOfLayers[actParentId]
    if (!Array.isArray(layers)) return
    const $parentCanvas = document.getElementById(actParentId)
    if (!($parentCanvas instanceof HTMLElement)) return
    const currentLayerIndex = layers.findIndex(l => l.id === actLayerId)
    if (currentLayerIndex === -1) return toast.error('❗️No se encontró la capa')
    const $currentCanvas = document.getElementById(actLayerId)
    if (!($currentCanvas instanceof HTMLCanvasElement)) return toast.error('❗️Parece que el lienzo no existe')
    const selectedLayer = layers[currentLayerIndex]
    const newLayerKey = newKey()
    const newLayer = {
      ...selectedLayer,
      id: newLayerKey,
      title: `copia-${selectedLayer.title}`
    }

    console.log('newLayer', newLayer)
    const updatedLayers = [...layers]
    updatedLayers.splice(currentLayerIndex + 1, 0, newLayer)
    setListOfLayers({ ...listOfLayers, [actParentId]: [...updatedLayers] })

    const timeout = setTimeout(() => {
      const $clonCanvas = document.getElementById(newLayerKey)
      if (!($clonCanvas instanceof HTMLCanvasElement)) return toast.error('❗️No se pudo clonar el lienzo')
      const ctx = $clonCanvas.getContext('2d')
      if (!ctx) return
      ctx.drawImage($currentCanvas, 0, 0)
      clearTimeout(timeout)
      $clonCanvas.style.opacity = `${newLayer.opacity}%`
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
