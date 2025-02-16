import boardStore from '@/shared/components/Board/board.store'
import React, { MouseEvent, RefObject, useCallback, useEffect, useRef, useState } from 'react'

import ActiveDrawsStore from '../../store/ActiveDraws.store'
import { TPositions } from '../../store/canvas.store'

interface ICameraViewer {
  $canvas: RefObject<HTMLElement | null>
  canvasWidth: number
  canvasHeight: number
}

const CameraViewer = ({ $canvas, canvasHeight, canvasWidth }: ICameraViewer) => {
  const [isDragging, setIsDragging] = useState(false)
  const { scale, setOffset, offset } = boardStore()
  const { actParentId } = ActiveDrawsStore()
  const isMovingCamera = useRef<boolean>(false)

  const $camera = useRef<HTMLButtonElement>(null)

  const startPosition = useRef<TPositions>({ x: 0, y: 0 })
  const [cameraPosition, setCameraPosition] = useState<TPositions>({
    x: canvasWidth / 5,
    y: canvasHeight / 5
  })

  const handleMouseCameraMove = useCallback(
    (e: globalThis.MouseEvent) => {
      if (!isDragging || !$camera.current || !$canvas.current) return
      isMovingCamera.current = true

      const updateCameraPosition = () => {
        const deltaX = e.clientX - startPosition.current.x
        const deltaY = e.clientY - startPosition.current.y

        startPosition.current = { x: e.clientX, y: e.clientY }

        setCameraPosition(prev => {
          if (!$camera.current) return prev
          const newX = Math.max(0, Math.min(canvasWidth - 60, prev.x + deltaX))
          const newY = Math.max(0, Math.min(canvasHeight - 60, prev.y + deltaY))
          return { x: newX, y: newY }
        })

        setOffset({
          x: offset.x - deltaX * scale,
          y: offset.y - deltaY * scale
        })
      }

      requestAnimationFrame(updateCameraPosition)
    },
    [isDragging, $canvas, offset, scale, setOffset, canvasWidth, canvasHeight]
  )

  const handleMouseCameraUp = () => {
    isMovingCamera.current = false
    setIsDragging(false)
  }

  const handleMouseDown = (e: MouseEvent) => {
    setIsDragging(true)
    startPosition.current = { x: e.clientX, y: e.clientY }
  }

  const handleMove = useCallback(
    (e: globalThis.MouseEvent) => {
      if (!$camera.current || !$canvas.current || isMovingCamera.current) return

      const element = e.target as HTMLElement
      const rect = element.getBoundingClientRect()
      const { offsetHeight, offsetWidth } = $canvas.current

      // Tamaño fijo de la cámara
      const cameraSize = 60

      // Calcular la posición de la cámara
      const x = (e.clientX - rect.left) / scale
      const y = (e.clientY - rect.top) / scale

      const mappedX = (x / element.offsetWidth) * offsetWidth - cameraSize / 2
      const mappedY = (y / element.offsetHeight) * offsetHeight - cameraSize / 2
      const limitedX = Math.max(0, Math.min(offsetWidth - cameraSize, mappedX))
      const limitedY = Math.max(0, Math.min(offsetHeight - cameraSize, mappedY))

      const updateCameraPosition = () => {
        setCameraPosition({ x: limitedX, y: limitedY })

        // Ajustar el tamaño de la cámara en el DOM
        if ($camera.current) {
          $camera.current.style.width = `${cameraSize}px`
          $camera.current.style.height = `${cameraSize}px`
        }
      }

      requestAnimationFrame(updateCameraPosition)
    },
    [$canvas, scale]
  )

  useEffect(() => {
    const $parentEvent = document.getElementById(actParentId)
    if (!($parentEvent instanceof HTMLElement)) return
    const handleMouseMove = (e: globalThis.MouseEvent) => handleMove(e)
    $parentEvent.addEventListener('mousemove', handleMouseMove)
    return () => {
      $parentEvent.removeEventListener('mousemove', handleMouseMove)
    }
  }, [actParentId, scale, handleMove])

  useEffect(() => {
    const handleMouseMove = (e: globalThis.MouseEvent) => handleMouseCameraMove(e)
    const handleMouseUp = () => handleMouseCameraUp()

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, handleMouseCameraMove])

  return (
    <button
      ref={$camera}
      style={{
        left: `${cameraPosition.x}px`,
        top: `${cameraPosition.y}px`,
        width: '60px',
        height: '60px'
      }}
      className='canvasViewer-camera'
      onMouseDown={handleMouseDown}
    />
  )
}

export default CameraViewer
