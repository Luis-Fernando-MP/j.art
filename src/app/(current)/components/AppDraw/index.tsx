'use client'

import { acl } from '@/shared/acl'
import boardStore, { MAX_SCALE, MIN_SCALE } from '@/shared/components/Board/board.store'
import { BoardRef } from '@/shared/components/Board/useBoard'
import { newKey } from '@/shared/key'
import { PlusIcon } from 'lucide-react'
import dynamic from 'next/dynamic'
import { type JSX, useRef } from 'react'

import CanvasStore from '../../store/canvas.store'
import './style.scss'

interface IAppDraw {
  className?: string
}

const BoardCanvas = dynamic(() => import('../BoardCanvas'), {
  ssr: false
})

const AppDraw = ({ className = '' }: IAppDraw): JSX.Element => {
  const { listOfCanvas, selectedCanvas, setSelectedCanvas, setListOfCanvas } = CanvasStore()

  const { scale, setScale, moveToChild } = boardStore()

  const handleNewCanvas = (): void => {
    const newId = newKey()
    setListOfCanvas([...listOfCanvas, newId])
  }

  return (
    <main className={`${className} appDraw`}>
      <BoardCanvas className='appDraw-board' />

      <section className='appDraw-frames'>
        <input
          type='range'
          min={MIN_SCALE}
          step={0.05}
          max={MAX_SCALE}
          value={scale}
          onChange={e => {
            setScale(Number(e.target.value))
          }}
        />

        {listOfCanvas.map((canvasId, i) => {
          const key = `${canvasId}-action-frame`

          return (
            <button
              className={`appDraw-frames__action ${acl(selectedCanvas === canvasId)}`}
              key={key}
              onClick={() => {
                setSelectedCanvas(canvasId)
                if (moveToChild) moveToChild(i)
              }}
            >
              <canvas className='appDraw-frames__canvas' />
            </button>
          )
        })}

        <button className='appDraw-frames__action' onClick={handleNewCanvas}>
          <PlusIcon />
        </button>
      </section>
    </main>
  )
}

export default AppDraw
