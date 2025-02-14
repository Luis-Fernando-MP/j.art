import Board from '@/shared/components/Board'
import boardStore from '@/shared/components/Board/board.store'
import StoreHorizontalSlider from '@/shared/components/HorizontalSlider/store'
import { PlusIcon } from 'lucide-react'
import { type JSX, MouseEvent, memo, useCallback } from 'react'
import toast from 'react-hot-toast'

import ActiveDrawsStore from '../../store/ActiveDraws.store'
import CanvasStore from '../../store/canvas.store'
import LayerStore from '../../store/layer.store'
import CanvasList from './CanvasList'
import './style.scss'

const Canvas = (): JSX.Element => {
  const { moveToChild } = boardStore()
  const { moveToChild: horizontalMvChild } = StoreHorizontalSlider()
  const { dimensions } = CanvasStore()
  const { setListOfLayers, addNewFrame } = LayerStore()
  const { setActParentId, setActParentIndex, setActLayerId } = ActiveDrawsStore()

  const handleAddNewParentFrame = useCallback(
    (e: MouseEvent) => {
      if (e.ctrlKey) return
      const frame = addNewFrame()
      if (!frame) return
      const { frameKey, index, layerId } = frame

      setActParentId(frameKey)
      setActParentIndex(index)
      setActLayerId(layerId)

      moveToChild(index)
      horizontalMvChild(index)
      toast.success('🎨 Estamos listos!!')
    },
    [setListOfLayers, horizontalMvChild, moveToChild, setActParentId, setActParentIndex, setActLayerId]
  )

  return (
    <>
      <CanvasList />
      <button
        className='canvasBoard-addFrame'
        onClick={handleAddNewParentFrame}
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
