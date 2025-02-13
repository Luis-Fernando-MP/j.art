import { EyeClosed, EyeIcon } from 'lucide-react'
import { type JSX, memo } from 'react'
import toast from 'react-hot-toast'

import LayerStore from '../../store/layer.store'

interface ICanvasSeeMode {
  layerId: string
  parentId: string
  className: string
  isWatching: boolean
}

const CanvasSeeMode = ({ className, layerId, isWatching, parentId }: ICanvasSeeMode): JSX.Element => {
  const { updateLayer } = LayerStore()

  const handleSeeMode = () => {
    const $canvas = document.getElementById(layerId)
    if (!($canvas instanceof HTMLCanvasElement)) return toast.error('😟 Lienzo no encontrado')
    $canvas.style.display = !isWatching ? 'block' : 'none'
    updateLayer({
      layer: { id: layerId, isWatching: !isWatching },
      parentId
    })
  }
  return (
    <button className={className} onClick={handleSeeMode}>
      {isWatching ? <EyeIcon /> : <EyeClosed />}
    </button>
  )
}

export default memo(CanvasSeeMode)
