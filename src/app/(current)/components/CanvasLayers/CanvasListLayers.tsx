import { type JSX } from 'react'

import LayerStore from '../../store/layer.store'
import CanvasLayer from '../CanvasLayer'

const CanvasListLayers = (): JSX.Element | null => {
  const { listOfLayers, idParentLayer } = LayerStore()
  const layers = listOfLayers[idParentLayer.id]
  if (!layers) return null
  return (
    <div className='canvasLayers-list'>
      {layers.map(layer => {
        return <CanvasLayer layer={layer} key={`item-layer-${layer.id}`} />
      })}
    </div>
  )
}

export default CanvasListLayers
