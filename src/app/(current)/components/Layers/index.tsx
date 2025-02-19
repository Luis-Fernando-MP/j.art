import { acl } from '@/shared/acl'
import boardStore from '@/shared/components/Board/board.store'
import StoreHorizontalSlider from '@/shared/components/HorizontalSlider/store'
import { type JSX, MouseEvent, memo, useCallback } from 'react'

import ActiveDrawsStore from '../../store/ActiveDraws.store'
import CanvasStore from '../../store/canvas.store'
import { Layer } from '../../store/layer.store'
import RepaintDrawingStore from '../../store/repaintDrawing.store'
import Canvas from '../Canvas'
import './style.scss'

interface ILayers {
  layers: Layer[]
  isDisable: boolean
  parentId: string
  index: number
  firstLayerId: string
}

const Layers = ({ layers, isDisable, parentId, index, firstLayerId }: ILayers): JSX.Element => {
  const { dimensions } = CanvasStore()
  const { actLayerId, setActParentId, setActParentIndex, setActLayerId } = ActiveDrawsStore()

  const { setRepaint } = RepaintDrawingStore()

  const { moveToChild } = boardStore()
  const { moveToChild: mvHorizontalSlider } = StoreHorizontalSlider()

  const handleClick = useCallback(
    (e: MouseEvent) => {
      if (e.ctrlKey || !isDisable) return
      setActParentId(parentId)
      setActParentIndex(index)
      setActLayerId(firstLayerId)
      moveToChild(index)
      mvHorizontalSlider(index)
      setRepaint('zoom')
    },
    [index, mvHorizontalSlider, setActParentId, setActParentIndex, parentId, isDisable, moveToChild]
  )

  return (
    <section
      role='button'
      tabIndex={0}
      className={`layers ${acl(isDisable, 'disable')}`}
      style={{ minWidth: dimensions.width + 4, minHeight: dimensions.height + 4 }}
      onClick={handleClick}
      id={parentId}
    >
      <div className='layers-background' />
      {layers.toReversed().map(layer => {
        const { id } = layer
        return <Canvas canvasId={id} key={id} isActive={id === actLayerId} />
      })}
      <div className='layers-grid' />
      <div className='layers-cross' />
    </section>
  )
}

export default memo(Layers)
