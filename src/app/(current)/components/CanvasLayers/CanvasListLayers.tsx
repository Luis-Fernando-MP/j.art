import { type JSX } from 'react'

import LayerStore from '../../store/layer.store'
import CanvasLayer from '../CanvasLayer'

const CanvasListLayers = (): JSX.Element | null => {
  const { listOfLayers, idParentLayer, activeLayer } = LayerStore()
  const layers = listOfLayers[idParentLayer.id]

  if (!layers) return null

  return (
    <div className='canvasLayers-list'>
      {layers.map(layer => {
        return <CanvasLayer layer={layer} key={`item-layer-${layer.id}`} isActive={layer.id === activeLayer.id} />
      })}
    </div>
  )
}

export default CanvasListLayers
