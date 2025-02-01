import Board from '@/shared/components/Board'
import { PlusIcon } from 'lucide-react'
import { type JSX } from 'react'

import CanvasStore from '../../store/canvas.store'
import Canvas from '../Canvas'

interface IBoardCanvas {
  className?: string
}

const BoardCanvas = ({ className = '' }: IBoardCanvas): JSX.Element => {
  const { dimensions, listOfCanvas } = CanvasStore()

  return (
    <Board className={`${className}`} isCenter={false}>
      {() => {
        return (
          <>
            {listOfCanvas.map(canvasId => {
              return <Canvas key={canvasId} canvasId={canvasId} className='appDraw-board__wrapper' />
            })}

            <button
              className='appDraw-canvas__addFrame'
              style={{
                minWidth: dimensions.width,
                width: dimensions.width,
                height: dimensions.height,
                minHeight: dimensions.height
              }}
            >
              <PlusIcon />
            </button>
          </>
        )
      }}
    </Board>
  )
}

export default BoardCanvas
