import { MouseEvent, useEffect, useRef, useState } from 'react'

type TPositions = { x: number; y: number }

interface IUsePopupHook {
  isOpen: boolean
}

const usePopup = ({ isOpen }: IUsePopupHook) => {
  const $popupRef = useRef<HTMLElement>(null)
  const $dragPosition = useRef<TPositions | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const bodyRect = document.documentElement.getBoundingClientRect()

  const handleMouseMove = (e: globalThis.MouseEvent) => {
    if (!isDragging || !$dragPosition.current || !$popupRef.current) return
    e.preventDefault()
    const rect = $popupRef.current.getBoundingClientRect()
    const deltaX = e.clientX - $dragPosition.current.x
    const deltaY = e.clientY - $dragPosition.current.y
    const minX = 0
    const minY = 0
    const maxX = bodyRect.width - rect.width
    const maxY = bodyRect.height - rect.height
    $dragPosition.current = { x: e.clientX, y: e.clientY }
    setPosition(prev => {
      let newX = prev.x + deltaX
      let newY = prev.y + deltaY
      newX = Math.max(minX, Math.min(newX, maxX))
      newY = Math.max(minY, Math.min(newY, maxY))
      return { x: newX, y: newY }
    })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  useEffect(() => {
    if ($popupRef.current) {
      const rect = $popupRef.current.getBoundingClientRect()
      const newX = bodyRect.width / 2 - rect.width / 2
      setPosition({ x: newX, y: bodyRect.height / 2 })
    }
  }, [setPosition, isOpen])

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  })

  const handleMouseDown = (e: MouseEvent) => {
    if (!$popupRef.current) return
    setIsDragging(true)
    $dragPosition.current = { x: e.clientX, y: e.clientY }
  }
  return {
    $popupRef,
    position,
    handleMouseDown,
    isDragging
  }
}

export default usePopup
