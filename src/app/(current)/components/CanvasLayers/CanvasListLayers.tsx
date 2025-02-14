import { newKey } from '@/shared/key'
import { type JSX } from 'react'

import ActiveDrawsStore from '../../store/ActiveDraws.store'
import LayerStore from '../../store/layer.store'
import CanvasLayer from '../CanvasLayer'

const CanvasListLayers = (): JSX.Element | null => {
  const { listOfLayers } = LayerStore()
  const { actParentId } = ActiveDrawsStore()
  const layers = listOfLayers[actParentId]
  if (!layers) return null

  return (
    <div className='canvasLayers-list'>
      {layers.map(layer => {
        const key = newKey()
        return <CanvasLayer layer={layer} key={key} />
      })}
    </div>
  )
}

export default CanvasListLayers
