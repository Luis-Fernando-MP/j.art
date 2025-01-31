'use client'

import { JSX, forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'

import './style.scss'

type TPositions = { x: number; y: number }

interface BoardProps {
  children: (offset: TPositions, scale: number) => JSX.Element
  className?: string
  isCenter?: boolean
}

export interface BoardRef {
  nextChild: () => void
  prevChild: () => void
  moveToChild: (index: number) => void
  handleScale: (scale: number) => void
}

export const MIN_SCALE = 0.7
export const MAX_SCALE = 10
const INITIAL_SCALE = 1

const Board = forwardRef(({ children, className = '', isCenter = true }: BoardProps, ref): JSX.Element => {
  const $containerRef = useRef<HTMLDivElement>(null)
  const $childrenRef = useRef<HTMLDivElement>(null)

  const [isMoving, setIsMoving] = useState(false)
  const [lastMousePosition, setLastMousePosition] = useState<TPositions | null>(null)
  const [scale, setScale] = useState(INITIAL_SCALE)
  const [offset, setOffset] = useState<TPositions>({ x: 0, y: 0 })
  const [childIndex, setChildIndex] = useState(0)

  const handleScale = (scale: number): void => {
    setScale(scale)
  }

  const noExistRefs = !$containerRef.current || !$childrenRef.current

  const getDynamicScale = (parent: DOMRect, children: DOMRect) => {
    const paAspect = parent.width / parent.height
    const chiAspect = children.width / children.height
    let scale: number
    if (paAspect > chiAspect) scale = parent.height / children.height
    else scale = parent.width / children.width
    const maxScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, scale))
    const minScale = Math.min(MIN_SCALE, Math.min(MAX_SCALE, scale))
    return { scale, maxScale, minScale }
  }

  const centerAndFit = () => {
    if (!$containerRef.current || !$childrenRef.current) return
    const paRect = $containerRef.current.getBoundingClientRect()
    const chiRect = $childrenRef.current.getBoundingClientRect()
    const { scale } = getDynamicScale(paRect, chiRect)
    const newOffsetX = (paRect.width - chiRect.width * scale) / 2
    const newOffsetY = (paRect.height - chiRect.height * scale) / 2
    setScale(scale)
    setOffset({ x: newOffsetX, y: newOffsetY })
  }

  const centerWithSpacing = () => {
    if (!$containerRef.current || !$childrenRef.current) return
    const paRect = $containerRef.current.getBoundingClientRect()
    const childrenRect = $childrenRef.current.getBoundingClientRect()
    const { maxScale } = getDynamicScale(paRect, childrenRect)
    setScale(maxScale)
    moveToChild(0, maxScale)
  }

  const moveToChild = (index: number, extraScale: number = 1) => {
    if (!$childrenRef.current || !$containerRef.current) return
    const children = Array.from($childrenRef.current.children) as HTMLElement[]
    if (index < 0 || index >= children.length) return

    const paRect = $containerRef.current.getBoundingClientRect()
    const chiRect = children[index].getBoundingClientRect()
    const childrenRect = $childrenRef.current.getBoundingClientRect()

    const distance = chiRect.left - childrenRect.left
    const centerXSpace = paRect.width / 2 - (chiRect.width * extraScale) / 2
    const newOffsetY = (paRect.height - childrenRect.height * extraScale) / 2

    setOffset({ x: -distance + centerXSpace, y: newOffsetY })
    setChildIndex(index)
  }

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
    if (canvas) {
      canvas.addEventListener('wheel', handleWheel, { passive: false })
    }
    return () => {
      canvas?.removeEventListener('wheel', handleWheel)
    }
  }, [scale, offset])

  useEffect(() => {
    if (isCenter) return centerAndFit()
    centerWithSpacing()
  }, [])

  useImperativeHandle<unknown, BoardRef>(ref, () => ({
    nextChild: () => moveToChild(childIndex + 1),
    prevChild: () => moveToChild(childIndex - 1),
    moveToChild,
    handleScale
  }))

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
})

export default Board
