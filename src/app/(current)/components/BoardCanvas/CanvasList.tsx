import { JSX, memo } from 'react'

import ActiveDrawsStore from '../../store/ActiveDraws.store'
import LayerStore from '../../store/layer.store'
import Layers from '../Layers'

const CanvasList = (): JSX.Element => {
  const { listOfLayers } = LayerStore()
  const { actParentId } = ActiveDrawsStore()
  return (
    <>
      {Object.entries(listOfLayers).map((layer, index) => {
        const [parentId, layers] = layer
        const firstLayerId = layers[0]?.id
        return (
          <Layers
            key={parentId}
            layers={layers}
            isDisable={actParentId !== parentId}
            parentId={parentId}
            index={index}
            firstLayerId={firstLayerId}
          />
        )
      })}
    </>
  )
}

export default memo(CanvasList)
