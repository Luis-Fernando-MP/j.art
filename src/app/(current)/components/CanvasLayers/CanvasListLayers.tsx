import dynamic from 'next/dynamic'
import { type JSX } from 'react'

import ActiveDrawsStore from '../../store/ActiveDraws.store'
import LayerStore from '../../store/layer.store'

const CanvasLayer = dynamic(() => import('../CanvasLayer'), {
  ssr: false
})
const CanvasListLayers = (): JSX.Element | null => {
  const { listOfLayers } = LayerStore()
  const { actParentId, actLayerId, setActLayerId } = ActiveDrawsStore()
  const layers = listOfLayers[actParentId]

  const handleSelectedLayer = (id: string) => {
    setActLayerId(id)
  }

  if (!layers) return null

  return (
    <div className='canvasLayers-list'>
      {layers.map(layer => {
        return <CanvasLayer layer={layer} key={layer.id} isActive={layer.id === actLayerId} handleActive={handleSelectedLayer} />
      })}
    </div>
  )
}

export default CanvasListLayers
