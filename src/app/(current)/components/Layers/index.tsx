import { acl } from '@/shared/acl'
import boardStore from '@/shared/components/Board/board.store'
import StoreHorizontalSlider from '@/shared/components/HorizontalSlider/store'
import { type JSX, MouseEvent, memo, useCallback } from 'react'

import CanvasStore from '../../store/canvas.store'
import LayerStore, { Layer } from '../../store/layer.store'
import Canvas from '../Canvas'
import './style.scss'

interface ILayers {
  layers: Layer[]
  isDisable: boolean
  parentId: string
  index: number
}

const Layers = ({ layers, isDisable, parentId, index }: ILayers): JSX.Element => {
  const { dimensions } = CanvasStore()
  const { setIdParentLayer, activeLayer } = LayerStore()
  const { moveToChild } = boardStore()
  const { moveToChild: mvHorizontalSlider } = StoreHorizontalSlider()

  const handleClick = useCallback(
    (e: MouseEvent) => {
      if (e.ctrlKey || !isDisable) return
      setIdParentLayer({ id: parentId, index })
      moveToChild(index)
      mvHorizontalSlider(index)
    },
    [parentId, isDisable, moveToChild, setIdParentLayer]
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
        return <Canvas canvasId={id} key={id} isActive={id === activeLayer.id} />
      })}
      <div className='layers-grid' />
    </section>
  )
}

export default memo(Layers)
