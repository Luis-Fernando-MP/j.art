import { type JSX, memo } from 'react'

import ActiveDrawsStore from '../../store/ActiveDraws.store'
import LayerStore from '../../store/layer.store'
import BoardFrame from '../boardFrame'

const ListBoardFrames = (): JSX.Element => {
  const { listOfLayers } = LayerStore()
  const { actParentId } = ActiveDrawsStore()

  return (
    <>
      {Object.entries(listOfLayers).map((element, i) => {
        const [parentKey, layers] = element
        const firstLayer = layers[0]?.id
        const isActive = actParentId === parentKey
        return <BoardFrame key={parentKey} parentKey={parentKey} index={i} isActive={isActive} firstLayer={firstLayer} />
      })}
    </>
  )
}

export default memo(ListBoardFrames)
