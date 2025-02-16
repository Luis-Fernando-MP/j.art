'use client'

import {
  type HtmlHTMLAttributes,
  type JSX,
  MouseEvent,
  type ReactNode,
  WheelEvent,
  useCallback,
  useEffect,
  useRef,
  useState
} from 'react'

import StoreHorizontalSlider from './store'
import './style.scss'

interface IHorizontalSlider extends HtmlHTMLAttributes<HTMLElement> {
  children?: Readonly<ReactNode[]> | null | Readonly<ReactNode>
  parentClass?: string
}

function HorizontalSlider({ children, className = '', parentClass = '', ...props }: Readonly<IHorizontalSlider>): JSX.Element {
  const $parentRef = useRef<HTMLElement>(null)
  const $sliderRef = useRef<HTMLDivElement>(null)
  const startX = useRef(0)
  const [offsetX, setOffsetX] = useState(0)
  const isDragging = useRef(false)
  const { setMoveToChild } = StoreHorizontalSlider()

  const handleMouseDown = useCallback((e: MouseEvent) => {
    if (!e.ctrlKey) return
    isDragging.current = true
    startX.current = e.clientX
  }, [])

  const handleMouseUp = useCallback(() => {
    isDragging.current = false
  }, [])

  const handleMouseMove = useCallback(
    (e: MouseEvent): void => {
      if (!isDragging.current || !$parentRef.current || !$sliderRef.current) return
      const { width: parentWidth } = $parentRef.current.getBoundingClientRect()
      const { width: sliderWidth } = $sliderRef.current.getBoundingClientRect()
      const deltaX = e.clientX - startX.current
      const minOffset = Math.min(0, parentWidth - sliderWidth)
      const newOffset = Math.max(minOffset, Math.min(0, offsetX + deltaX))
      setOffsetX(newOffset)
      startX.current = e.clientX
    },
    [offsetX]
  )

  const handleWheel = useCallback(
    (e: WheelEvent) => {
      e.preventDefault()
      if (!$sliderRef.current) return
      if (!$parentRef.current || !$sliderRef.current) return
      const delta = e.deltaY
      const newOffset = offsetX - delta
      const { width: parentWidth } = $parentRef.current.getBoundingClientRect()
      const { width: sliderWidth } = $sliderRef.current.getBoundingClientRect()
      const minOffset = Math.min(0, parentWidth - sliderWidth)
      setOffsetX(Math.max(minOffset, Math.min(0, newOffset)))
    },
    [offsetX]
  )

  const moveToChild = useCallback(
    (index: number) => {
      if (!$parentRef.current || !$sliderRef.current) return
      const children = Array.from($sliderRef.current.children) as HTMLElement[]
      if (index < 0 || index >= children.length) return

      const parentRect = $parentRef.current.getBoundingClientRect()
      const childRect = children[index].getBoundingClientRect()
      const sliderRect = $sliderRef.current.getBoundingClientRect()

      const childLeftRelativeToSlider = childRect.left - sliderRect.left
      const parentWidth = parentRect.width
      const childWidth = childRect.width
      const sliderWidth = sliderRect.width
      let newOffset = offsetX - childLeftRelativeToSlider + (parentWidth / 2 - childWidth / 2)
      const minOffset = Math.min(0, parentWidth - sliderWidth)

      newOffset = Math.max(minOffset, Math.min(0, newOffset))
      setOffsetX(newOffset)
      $sliderRef.current.classList.add('animate')
      setTimeout(() => {
        $sliderRef.current?.classList.remove('animate')
      }, 200)
    },
    [offsetX]
  )

  useEffect(() => {
    setMoveToChild(moveToChild)
  }, [setMoveToChild, moveToChild])

  return (
    <section
      className={`horizontalSlider ${parentClass}`}
      role='button'
      tabIndex={0}
      ref={$parentRef}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onMouseMove={handleMouseMove}
      onWheel={handleWheel}
    >
      <div
        className={`horizontalSlider-wrapper ${className}`}
        ref={$sliderRef}
        style={{
          left: `${offsetX}px`,
          opacity: $sliderRef.current ? 1 : 0
        }}
        {...props}
      >
        {children}
      </div>
    </section>
  )
}

export default HorizontalSlider
