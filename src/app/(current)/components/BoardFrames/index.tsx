'use client'

import { acl } from '@/shared/acl'
import boardStore from '@/shared/components/Board/board.store'
import { newKey } from '@/shared/key'
import { PlusIcon } from 'lucide-react'
import { type JSX } from 'react'

import CanvasStore from '../../store/canvas.store'
import './style.scss'

interface IBoardFrames {
  className?: string
}

const BoardFrames = ({ className = '' }: IBoardFrames): JSX.Element => {
  const { listOfCanvas, selectedCanvas, setSelectedCanvas, setListOfCanvas, dimensions } = CanvasStore()

  const { moveToChild } = boardStore()

  const handleNewCanvas = (): void => {
    const newId = newKey()
    setListOfCanvas([...listOfCanvas, newId])
  }

  const width = dimensions.width * 0.1
  const height = dimensions.height * 0.1
  const clampWidth = Math.min(60, width)
  const clampHeight = Math.min(60, height)

  return (
    <section className={`${className} boardFrames`}>
      {listOfCanvas.map((canvasId, i) => {
        const key = `${canvasId}-action-frame`

        return (
          <button
            className={`boardFrames-actionCanvas ${acl(selectedCanvas === canvasId)}`}
            key={key}
            onClick={() => {
              setSelectedCanvas(canvasId)
              if (moveToChild) moveToChild(i)
            }}
          >
            <canvas id={`${canvasId}-frame-action`} width={clampWidth} height={clampHeight} />
          </button>
        )
      })}

      <button className='boardFrames-action' onClick={handleNewCanvas}>
        <PlusIcon />
      </button>
    </section>
  )
}

export default BoardFrames
