import { useEffect, useRef, useState } from 'react'

import CanvasStore from '../store/canvas.store'

const useCanvas = () => {
  const $canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [canvasSize, setCanvasSize] = useState({ w: 500, h: 500 })
  const { pixelColor, pixelOpacity, pixelSize } = CanvasStore()
  const PIXEL_SIZE = pixelSize

  console.log(pixelSize)

  useEffect(() => {
    const updateCanvasSize = () => {
      const parent = document.getElementById('canvasContainer')
      if (!parent) return
      const { canvas, ctx } = getContext()
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      setCanvasSize({
        w: parent.clientWidth,
        h: parent.clientHeight
      })
      setTimeout(() => {
        const { ctx } = getContext()
        ctx.putImageData(imageData, 0, 0)
      }, 0)
    }

    updateCanvasSize()
    window.addEventListener('resize', updateCanvasSize)
    return () => {
      window.removeEventListener('resize', updateCanvasSize)
    }
  }, [])

  useEffect(() => {
    // change grid
    const $gridElement = document.getElementById('canvas-grid')
    if (!($gridElement instanceof HTMLElement)) return
    $gridElement.style.setProperty('--s-grid', `${pixelSize}px`)
  }, [pixelSize, canvasSize])

  const [tool, setTool] = useState({
    type: 'brush',
    color: 'rgb(255, 255, 255)',
    opacity: 1,
    mirror: { horizontal: false, vertical: false }
  })

  const getContext = () => {
    const canvas = $canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) throw new Error('canvas is undefined')
    return { canvas, ctx }
  }

  const getCanvasCoordinates = (e: React.MouseEvent) => {
    const { canvas } = getContext()
    const rect = canvas.getBoundingClientRect()
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    }
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    const positions = getCanvasCoordinates(e)
    if (!positions) return
    setIsDrawing(true)
    handleDrawing(positions.x, positions.y)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    const positions = getCanvasCoordinates(e)
    if (!isDrawing) return
    handleDrawing(positions.x, positions.y)
  }

  const handleMouseUp = () => {
    if (!isDrawing) return
    setIsDrawing(false)
  }

  const drawPixel = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    color: string,
    size: number,
    opacity = 1
  ) => {
    ctx.globalAlpha = opacity
    ctx.fillStyle = color
    ctx.fillRect(x, y, size, size)
    ctx.globalAlpha = 1
  }

  const handleDrawing = (x: number, y: number) => {
    const canvas = $canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    const alignedX = Math.floor(x / PIXEL_SIZE) * PIXEL_SIZE
    const alignedY = Math.floor(y / PIXEL_SIZE) * PIXEL_SIZE

    const actions: any = {
      brush: () => drawPixel(ctx, alignedX, alignedY, tool.color, pixelSize)
    }

    actions[tool.type]?.()
  }

  return {
    $canvasRef,
    canvasSize,
    handleMouseDown,
    handleMouseMove
  }
}

export default useCanvas
