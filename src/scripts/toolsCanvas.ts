'use client'

import { MouseEvent } from 'react'

import { getContext } from './transformCanvas'

export const getCanvasCoordinates = (e: MouseEvent, scale: number) => {
  const { canvas } = getContext()
  const rect = canvas.getBoundingClientRect()
  return { x: (e.clientX - rect.left) / scale, y: (e.clientY - rect.top) / scale }
}

type THandleDrawPixel = {
  ctx: CanvasRenderingContext2D
  x: number
  y: number
  pixelColor: string
  pixelSize: number
  pixelOpacity: number
  xMirror: boolean
  yMirror: boolean
}
export function handleDrawPixel({ pixelColor, ctx, pixelOpacity, pixelSize, x, xMirror, y, yMirror }: THandleDrawPixel) {
  ctx.beginPath()
  ctx.imageSmoothingEnabled = false
  ctx.globalAlpha = pixelOpacity
  ctx.fillStyle = pixelColor
  ctx.fillRect(x, y, pixelSize, pixelSize)
  ctx.closePath()
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

export function HandleDeletePixel(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
  ctx.clearRect(x, y, size, size)
}

export function handlePipetteColor(ctx: CanvasRenderingContext2D, x: number, y: number) {
  const { width, height } = ctx.canvas
  const imageData = ctx.getImageData(0, 0, width, height)
  const [r, g, b, a] = getPixelColor(imageData, Math.floor(x), Math.floor(y), width)
  const color = `rgba(${r}, ${g}, ${b}, ${a})`
  return { rgba: color, iterable: [r, g, b, a], imageData }
}

export function handlePaintBucket(ctx: CanvasRenderingContext2D, startX: number, startY: number, fillColor: string) {
  const { width, height } = ctx.canvas
  const { iterable, imageData } = handlePipetteColor(ctx, startX, startY)
  const pixelData = imageData.data
  const toIterableColor = (color: string) => {
    const newString = color.replace('rgba(', '').replace(')', '')
    return newString.split(',').map(Number)
  }
  const bgColor = toIterableColor(fillColor)
  console.log(fillColor, bgColor, iterable)

  // Si el color inicial es igual al color de relleno
  if (iterable.every((v, i) => v === bgColor[i])) return

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
    pixelData[current] = bgColor[0]
    pixelData[current + 1] = bgColor[1]
    pixelData[current + 2] = bgColor[2]
    pixelData[current + 3] = bgColor[3]

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
