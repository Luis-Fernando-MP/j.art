import { type JSX } from 'react'

import LayerStore from '../../store/layer.store'
import CanvasLayer from '../CanvasLayer'

const CanvasListLayers = (): JSX.Element | null => {
  const { listOfLayers, idParentLayer, setActiveLayer, activeLayer } = LayerStore()
  const layers = listOfLayers[idParentLayer.id]

  if (!layers) return null

  return (
    <div className='canvasLayers-list'>
      {layers.map((layer, index) => {
        return (
          <CanvasLayer
            layer={layer}
            key={`item-layer-${layer.id}`}
            handleActiveLayer={() => setActiveLayer(layer.id)}
            isActive={layer.id === activeLayer}
          />
        )
      })}
    </div>
  )
}

export default CanvasListLayers
