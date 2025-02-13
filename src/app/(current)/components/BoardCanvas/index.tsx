import Board from '@/shared/components/Board'
import boardStore from '@/shared/components/Board/board.store'
import StoreHorizontalSlider from '@/shared/components/HorizontalSlider/store'
import { newKey } from '@/shared/key'
import { PlusIcon } from 'lucide-react'
import { type JSX, MouseEvent, memo, useCallback } from 'react'
import toast from 'react-hot-toast'

import CanvasStore from '../../store/canvas.store'
import LayerStore, { MAX_LAYERS } from '../../store/layer.store'
import CanvasList from './CanvasList'
import './style.scss'

const Canvas = (): JSX.Element => {
  const { moveToChild } = boardStore()
  const { moveToChild: horizontalMvChild } = StoreHorizontalSlider()
  const { dimensions } = CanvasStore()
  const { listOfLayers, setListOfLayers, setIdParentLayer } = LayerStore()

  const handleAddNewParentLayer = useCallback(
    (e: MouseEvent) => {
      if (e.ctrlKey) return
      const id = newKey()
      const newList = structuredClone(listOfLayers)
      const index = Object.keys(listOfLayers).length
      newList[id] = [
        {
          id: newKey(),
          parentId: id,
          imageUrl: null,
          title: `Capa ${index.toString().padStart(2, '0')}`,
          isWatching: true,
          opacity: 100
        }
      ]
      if (Object.keys(newList).length > MAX_LAYERS) return toast.error('🔥 hay muchos canvas')
      setListOfLayers(newList)
      setIdParentLayer({
        id,
        index
      })
      moveToChild(index)
      horizontalMvChild(index)
      toast.success('🎨 Estamos listos!!')
    },
    [listOfLayers, setListOfLayers, newKey]
  )

  return (
    <>
      <CanvasList />
      <button
        className='canvasBoard-addFrame'
        onClick={handleAddNewParentLayer}
        style={{
          width: dimensions.width,
          height: dimensions.height
        }}
      >
        <PlusIcon />
      </button>
    </>
  )
}

const MemoCanvas = memo(Canvas)

const BoardCanvas = (): JSX.Element => {
  return (
    <Board className='canvasBoard' isCenter={false}>
      {() => <MemoCanvas />}
    </Board>
  )
}

export default BoardCanvas
