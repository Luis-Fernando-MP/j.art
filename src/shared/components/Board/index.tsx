'use client'

import { JSX } from 'react'

import './style.scss'
import useBoard from './useBoard'

type TPositions = { x: number; y: number }

interface BoardProps {
  children: (offset: TPositions, scale: number) => JSX.Element
  className?: string
  isCenter?: boolean
}

const Board = ({ children, className = '', isCenter = true }: BoardProps): JSX.Element => {
  const { $containerRef, $childrenRef, noExistRefs, isMoving, offset, scale, handleBoardDown, handleBoardMove, handleBoardUp } =
    useBoard({ isCenter })

  return (
    <div
      role='button'
      tabIndex={0}
      className='board-zone'
      ref={$containerRef}
      onMouseDown={handleBoardDown}
      onMouseMove={handleBoardMove}
      onMouseUp={handleBoardUp}
      onMouseLeave={handleBoardUp}
      onContextMenu={e => e.preventDefault()}
      style={{
        opacity: noExistRefs ? 0 : 1,
        cursor: isMoving ? 'grabbing' : 'default'
      }}
    >
      <div
        className={`${className} board-children`}
        ref={$childrenRef}
        style={{
          top: offset.y,
          left: offset.x,
          transform: `scale(${scale})`
        }}
      >
        {children(offset, scale)}
      </div>
    </div>
  )
}

export default Board
