import type { JSX } from 'react'

import LayerStore from '../../store/layer.store'
import Layers from '../Layers'

const CanvasList = (): JSX.Element => {
  const { listOfLayers, idParentLayer } = LayerStore()

  return (
    <>
      {Object.entries(listOfLayers).map((layer, index) => {
        const [parentId, layers] = layer
        return (
          <Layers key={parentId} layers={layers} isDisable={idParentLayer.id !== parentId} parentId={parentId} index={index} />
        )
      })}
    </>
  )
}

export default CanvasList
