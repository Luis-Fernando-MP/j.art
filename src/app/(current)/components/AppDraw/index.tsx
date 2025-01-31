'use client'

import { acl } from '@/shared/acl'
import Board, { BoardRef, MAX_SCALE, MIN_SCALE } from '@/shared/components/Board'
import { PlusIcon } from 'lucide-react'
import { type JSX, useEffect, useRef, useState } from 'react'

import './style.scss'

interface IAppDraw {
  className?: string
}

const AppDraw = ({ className = '' }: IAppDraw): JSX.Element => {
  const $boardRef = useRef<BoardRef | null>(null)
  const [dimensions, setDimensions] = useState({
    width: 900,
    height: 900
  })

  const [selectedCanvas, setSelectedCanvas] = useState('')

  const [canvasList, setCanvasList] = useState(['abc', 'dfg', 'hij', 'klmn'])
  const [moveBoard, setMoveBoard] = useState({ x: 0, y: 0 })
  const [boardScale, setBoardScale] = useState(1)

  const moveBoardHandler = (dx: number, dy: number) => {
    setMoveBoard(prev => ({
      x: prev.x + dx,
      y: prev.y + dy
    }))
  }

  return (
    <main className={`${className} appDraw`}>
      <Board ref={$boardRef} className='appDraw-board' isCenter={false}>
        {() => {
          return (
            <>
              {canvasList.map(canvasId => {
                return (
                  <section
                    className='appDraw-board__wrapper'
                    key={canvasId}
                    style={{
                      width: dimensions.width,
                      height: dimensions.height
                    }}
                  >
                    <div className='appDraw-board__background' />
                    <canvas className='appDraw-board__canvas' id={canvasId} />
                    <div className='appDraw-board__grid' />
                  </section>
                )
              })}

              <button
                className='appDraw-canvas__addFrame'
                style={{
                  width: dimensions.width,
                  height: dimensions.height
                }}
              >
                <PlusIcon />
              </button>
            </>
          )
        }}
      </Board>

      <section className='appDraw-frames'>
        <input
          type='range'
          min={0.7}
          max={10}
          value={boardScale}
          onChange={e => {
            setBoardScale(Number(e.target.value))
            $boardRef.current?.handleScale(Number(e.target.value))
          }}
        />

        {canvasList.map((canvasId, i) => {
          const key = `${canvasId}-action-frame`

          return (
            <button
              className={`appDraw-frames__action ${acl(selectedCanvas === canvasId)}`}
              key={key}
              onClick={() => {
                // if (selectedCanvas === canvasId) return
                console.log(canvasId, selectedCanvas)
                setSelectedCanvas(canvasId)
                if (!$boardRef.current) return
                $boardRef.current.moveToChild(i)
              }}
            >
              <canvas className='appDraw-frames__canvas' />
            </button>
          )
        })}

        <button className='appDraw-frames__action'>
          <PlusIcon />
        </button>
      </section>
    </main>
  )
}

export default AppDraw
