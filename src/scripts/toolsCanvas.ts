'use client'

import { MouseEvent } from 'react'

import { alignCord } from './bresenham'
import { getContext } from './transformCanvas'

export const getCanvasCoordinates = (e: MouseEvent, canvasId: string = 'canvas') => {
  const currentCanvas = getContext(canvasId)
  if (!currentCanvas) return
  const { ctx, canvas } = currentCanvas
  const canvasRect = canvas.getBoundingClientRect()
  const scaleX = canvas.width / canvasRect.width
  const scaleY = canvas.height / canvasRect.height

  const x = (e.clientX - canvasRect.left) * scaleX
  const y = (e.clientY - canvasRect.top) * scaleY
  return { x, y, ctx }
}

type THandleTool = {
  ctx: CanvasRenderingContext2D
  x: number
  y: number
  pixelSize: number
}

type TMirrorTool = {
  xMirror: boolean
  yMirror: boolean
}
type THandleDrawPixel = THandleTool &
  TMirrorTool & {
    pixelColor: string
    pixelOpacity: number
  }

type TInterpolateDrawing = {
  startX: number
  startY: number
  endX: number
  endY: number
  pixelSize: number
}
export function interpolateDrawing(props: TInterpolateDrawing) {
  const { startX, startY, endX, endY, pixelSize } = props

  const dx = Math.abs(endX - startX) / pixelSize
  const dy = Math.abs(endY - startY) / pixelSize
  let steps = Math.max(dx, dy)
  if (startX === endX && startY === endY) steps = 1

  const points = []

  for (let i = 0; i <= steps; i++) {
    const px = startX + (endX - startX) * (i / steps)
    const py = startY + (endY - startY) * (i / steps)
    points[i] = { x: alignCord(px, pixelSize), y: alignCord(py, pixelSize) }
  }

  return points
}

export function handleRevertDrawPixel({ pixelColor, ctx, pixelOpacity, pixelSize, x, xMirror, y, yMirror }: THandleDrawPixel) {
  // const { width, height } = ctx.canvas
  // const mirroredX = width - x - pixelSize
  // const mirroredY = height - y - pixelSize

  const alignedX = Math.floor(x)
  const alignedY = Math.floor(y)

  ctx.beginPath()
  ctx.imageSmoothingEnabled = false
  ctx.globalAlpha = pixelOpacity
  ctx.fillStyle = 'red'
  ctx.fillRect(alignedX, alignedY, pixelSize, pixelSize)

  // if (xMirror) ctx.fillRect(mirroredX, y, pixelSize, pixelSize)
  // if (yMirror) ctx.fillRect(x, mirroredY, pixelSize, pixelSize)
  // if (xMirror && yMirror) ctx.fillRect(mirroredX, mirroredY, pixelSize, pixelSize)

  ctx.closePath()
}

export function handleDrawPixel({ pixelColor, ctx, pixelOpacity, pixelSize, x, xMirror, y, yMirror }: THandleDrawPixel) {
  // const { width, height } = ctx.canvas
  // const mirroredX = width - x - pixelSize
  // const mirroredY = height - y - pixelSize

  const alignedX = Math.floor(x)
  const alignedY = Math.floor(y)

  ctx.beginPath()
  ctx.imageSmoothingEnabled = false
  ctx.globalAlpha = pixelOpacity
  ctx.fillStyle = pixelColor
  ctx.fillRect(alignedX, alignedY, pixelSize, pixelSize)

  // if (xMirror) ctx.fillRect(mirroredX, y, pixelSize, pixelSize)
  // if (yMirror) ctx.fillRect(x, mirroredY, pixelSize, pixelSize)
  // if (xMirror && yMirror) ctx.fillRect(mirroredX, mirroredY, pixelSize, pixelSize)

  ctx.closePath()
}

export function HandleDeletePixel({ ctx, pixelSize, x, y, xMirror, yMirror }: THandleTool & TMirrorTool) {
  const { width, height } = ctx.canvas
  const mirroredX = width - x - pixelSize
  const mirroredY = height - y - pixelSize

  ctx.clearRect(x, y, pixelSize, pixelSize)
  if (xMirror) ctx.clearRect(mirroredX, y, pixelSize, pixelSize)
  if (yMirror) ctx.clearRect(x, mirroredY, pixelSize, pixelSize)
  if (xMirror && yMirror) ctx.clearRect(mirroredX, mirroredY, pixelSize, pixelSize)
}

export function getPixelColor(imageData: ImageData, alignedX: number, alignedY: number, width: number) {
  const index = (alignedY * width + alignedX) * 4
  const pixelData = imageData.data

  return [
    pixelData[index], // Red
    pixelData[index + 1], // Green
    pixelData[index + 2], // Blue
    pixelData[index + 3] // Alpha
  ]
}

export function handlePipetteColor(ctx: CanvasRenderingContext2D, x: number, y: number) {
  const { width, height } = ctx.canvas
  const imageData = ctx.getImageData(0, 0, width, height)
  const [r, g, b, a] = getPixelColor(imageData, Math.floor(x), Math.floor(y), width)
  let alpha = a
  if (alpha <= 0) alpha = 255
  const color = `rgba(${r}, ${g}, ${b}, ${alpha})`
  return { rgba: color, iterable: [r, g, b, a], imageData }
}

const toIterableColor = (color: string) => {
  const newString = color.replace('rgba(', '').replace(')', '')
  return newString.split(',').map(Number)
}

export function handlePaintBucket(ctx: CanvasRenderingContext2D, startX: number, startY: number, fillColor: string) {
  const { width, height } = ctx.canvas
  const { iterable, imageData } = handlePipetteColor(ctx, startX, startY)
  const pixelData = imageData.data

  const bgaColor = toIterableColor(fillColor)

  // Si el color inicial es igual al color de relleno
  if (iterable.every((v, i) => v === bgaColor[i])) return

  const getIndex = (x: number, y: number) => (y * width + x) * 4
  const isInsideCanvas = (x: number, y: number) => x >= 0 && x < width && y >= 0 && y < height
  const isSameColor = (i: number) =>
    pixelData[i] === iterable[0] &&
    pixelData[i + 1] === iterable[1] &&
    pixelData[i + 2] === iterable[2] &&
    pixelData[i + 3] === iterable[3]

  const stack = [[Math.floor(startX), Math.floor(startY)]]

  while (stack.length > 0) {
    const [currentX, currentY] = stack.pop()!
    if (!isInsideCanvas(currentX, currentY)) continue
    const current = getIndex(currentX, currentY)
    if (!isSameColor(current)) continue
    // Pintar el píxel actual
    pixelData[current] = bgaColor[0]
    pixelData[current + 1] = bgaColor[1]
    pixelData[current + 2] = bgaColor[2]
    pixelData[current + 3] = bgaColor[3]

    // Añadir píxeles vecinos a la pila
    stack.push([currentX - 1, currentY]) // Izquierda
    stack.push([currentX + 1, currentY]) // Derecha
    stack.push([currentX, currentY - 1]) // Arriba
    stack.push([currentX, currentY + 1]) // Abajo
  }
  ctx.putImageData(imageData, 0, 0)
}

export const handleClearCanvas = (ctx: CanvasRenderingContext2D) => {
  const { width, height } = ctx.canvas
  ctx.clearRect(0, 0, width, height)
}
