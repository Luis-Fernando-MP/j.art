import boardStore from '@/shared/components/Board/board.store'
import StoreHorizontalSlider from '@/shared/components/HorizontalSlider/store'
import { PlusIcon } from 'lucide-react'
import { type JSX, MouseEvent, memo, useCallback } from 'react'
import toast from 'react-hot-toast'

import ActiveDrawsStore from '../../store/ActiveDraws.store'
import CanvasStore from '../../store/canvas.store'
import LayerStore from '../../store/layer.store'
import RepaintDrawingStore from '../../store/repaintDrawing.store'

const AddFrame = (): JSX.Element => {
  const { moveToChild } = boardStore()
  const { moveToChild: horizontalMvChild } = StoreHorizontalSlider()
  const { dimensions } = CanvasStore()
  const { addNewFrame } = LayerStore()
  const { setActParentId, setActParentIndex, setActLayerId } = ActiveDrawsStore()
  const { cleanViewerFrame } = RepaintDrawingStore()

  const handleAddNewParentFrame = useCallback(
    (e: MouseEvent) => {
      if (e.ctrlKey) return
      const frame = addNewFrame()
      if (!frame) return
      const { frameKey, index, layerId } = frame
      cleanViewerFrame()
      setActParentId(frameKey)
      setActParentIndex(index)
      setActLayerId(layerId)

      moveToChild(index)
      horizontalMvChild(index)
      toast.success('🎨 Estamos listos!!')
    },
    [horizontalMvChild, moveToChild, setActParentId, setActParentIndex, setActLayerId, addNewFrame, cleanViewerFrame]
  )

  return (
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
  )
}

export default memo(AddFrame)
