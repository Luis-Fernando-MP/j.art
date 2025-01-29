'use client'

import { JSX, useEffect, useRef, useState } from 'react'

import './style.scss'

type TPositions = { x: number; y: number }

interface BoardProps {
  children: (offset: TPositions, scale: number) => JSX.Element
}

const Board = ({ children }: BoardProps): JSX.Element => {
  const MIN_SCALE = 0.5
  const MAX_SCALE = 10
  const INITIAL_SCALE = 1

  const $containerRef = useRef<HTMLDivElement>(null)

  const [isMoving, setIsMoving] = useState(false)
  const [lastMousePosition, setLastMousePosition] = useState<TPositions | null>(null)
  const [scale, setScale] = useState(INITIAL_SCALE)
  const [offset, setOffset] = useState<TPositions>({ x: 0, y: 0 })

  const handleContainerMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    if (e.ctrlKey) {
      setIsMoving(true)
      setLastMousePosition({ x: e.clientX, y: e.clientY })
    }
  }

  const handleContainerMouseMove = (e: React.MouseEvent) => {
    if (!isMoving || !lastMousePosition) return
    const deltaX = e.clientX - lastMousePosition.x
    const deltaY = e.clientY - lastMousePosition.y
    setOffset(prev => ({
      x: prev.x + deltaX,
      y: prev.y + deltaY
    }))
    setLastMousePosition({ x: e.clientX, y: e.clientY })
  }

  const handleContainerMouseUp = () => {
    setIsMoving(false)
    setLastMousePosition(null)
  }

  const handleWheel = (e: WheelEvent) => {
    if (!e.ctrlKey) return
    e.preventDefault()
    const zoomFactor = 1.1
    const canvas = $containerRef.current
    if (!canvas) return
    const newScale = e.deltaY < 0 ? scale * zoomFactor : scale / zoomFactor
    const clampedScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, newScale))
    const rect = canvas.getBoundingClientRect()
    const mouseX = (e.clientX - rect.left - offset.x) / scale
    const mouseY = (e.clientY - rect.top - offset.y) / scale
    setScale(clampedScale)
    setOffset(prev => ({
      x: prev.x - mouseX * (clampedScale - scale),
      y: prev.y - mouseY * (clampedScale - scale)
    }))
  }

  useEffect(() => {
    const canvas = $containerRef.current
    if (!canvas) return
    canvas.addEventListener('wheel', handleWheel, { passive: false })
    return () => {
      canvas.removeEventListener('wheel', handleWheel)
    }
  }, [scale, offset])

  return (
    <div
      role='button'
      tabIndex={0}
      className='board-zone'
      ref={$containerRef}
      onMouseDown={handleContainerMouseDown}
      onMouseMove={handleContainerMouseMove}
      onMouseUp={handleContainerMouseUp}
      onContextMenu={e => e.preventDefault()}
      style={{
        cursor: isMoving ? 'grabbing' : 'default'
      }}
    >
      <div
        className='board-children'
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
