import boardStore from '@/shared/components/Board/board.store'
import React, { MouseEvent, RefObject, useEffect, useRef, useState } from 'react'

import { TPositions } from '../../store/canvas.store'
import LayerStore from '../../store/layer.store'

interface ICameraViewer {
  $canvas: RefObject<HTMLCanvasElement | null>
  canvasWidth: number
  canvasHeight: number
}

const CameraViewer = ({ $canvas, canvasHeight, canvasWidth }: ICameraViewer) => {
  const [isDragging, setIsDragging] = useState(false)
  const { scale, setOffset, offset, moveToChild } = boardStore()
  const { idParentLayer } = LayerStore()
  const isMovingCamera = useRef<Boolean>(false)

  const $camera = useRef<HTMLButtonElement>(null)

  const startPosition = useRef<TPositions>({ x: 0, y: 0 })
  const [cameraPosition, setCameraPosition] = useState<TPositions>({
    x: canvasWidth / 3.5,
    y: canvasHeight / 3.5
  })

  const handleMouseCameraMove = (e: globalThis.MouseEvent) => {
    const $parentEvent = document.getElementById(idParentLayer.id)
    if (!($parentEvent instanceof HTMLElement)) return
    if (!isDragging || !$camera.current || !$canvas.current) return
    isMovingCamera.current = true
    const camRect = $camera.current.getBoundingClientRect()
    const canvasRect = $canvas.current.getBoundingClientRect()
    const { offsetWidth: offWCam, offsetHeight: offHCam } = $camera.current
    const { offsetWidth, offsetHeight } = $canvas.current

    const cameraLeft = camRect.left - canvasRect.left
    const cameraTop = camRect.top - canvasRect.top
    setOffset({
      x: offset.x - cameraLeft * scale,
      y: offset.y - cameraTop * scale
    })
    const deltaX = e.clientX - startPosition.current.x
    const deltaY = e.clientY - startPosition.current.y

    startPosition.current = { x: e.clientX, y: e.clientY }
    setCameraPosition(prev => {
      return {
        x: Math.max(0, Math.min(offsetWidth - offWCam - 10, prev.x + deltaX)),
        y: Math.max(0, Math.min(offsetHeight - offHCam - 10, prev.y + deltaY))
      }
    })
  }

  const handleMouseCameraUp = () => {
    if (!$camera.current) return
    isMovingCamera.current = false
    $camera.current.classList.remove('move')
    setIsDragging(false)
  }

  const handleMouseDown = (e: MouseEvent) => {
    if (!$camera.current) return
    $camera.current.classList.add('move')
    setIsDragging(true)
    startPosition.current = { x: e.clientX, y: e.clientY }
  }

  const handleMove = (e: globalThis.MouseEvent) => {
    if (!$camera.current || !$canvas.current || isMovingCamera.current) return
    const element = e.target as HTMLElement
    const rect = element.getBoundingClientRect()
    const { offsetHeight, offsetWidth } = $canvas.current
    const { offsetWidth: offWCam, offsetHeight: offHCam } = $camera.current

    const camWidth = offWCam
    const camHeight = offHCam
    const x = (e.clientX - rect.left) / scale
    const y = (e.clientY - rect.top) / scale

    const mappedX = (x / element.offsetWidth) * offsetWidth - camWidth
    const mappedY = (y / element.offsetHeight) * offsetHeight - camHeight
    const limitedX = Math.max(0, mappedX)
    const limitedY = Math.max(0, mappedY)
    setCameraPosition({ x: limitedX, y: limitedY })
  }

  useEffect(() => {
    const $parentEvent = document.getElementById(idParentLayer.id)
    if (!($parentEvent instanceof HTMLElement)) return
    $parentEvent.addEventListener('mousemove', handleMove)
    return () => {
      $parentEvent.removeEventListener('mousemove', handleMove)
    }
  }, [idParentLayer, scale])

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseCameraMove)
    window.addEventListener('mouseup', handleMouseCameraUp)
    return () => {
      window.removeEventListener('mousemove', handleMouseCameraMove)
      window.removeEventListener('mouseup', handleMouseCameraUp)
    }
  }, [isDragging])

  return (
    <button
      ref={$camera}
      style={{
        left: `${cameraPosition.x}px`,
        top: `${cameraPosition.y}px`
      }}
      className='canvasViewer-camera'
      onMouseDown={handleMouseDown}
    />
  )
}

export default CameraViewer
