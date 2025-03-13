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

type HandleMirrorTool = THandleTool & {
  xMirror: boolean
  yMirror: boolean
}

type THandleDraw = HandleMirrorTool & {
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
let lastX = -1
let lastY = -1

const transparentSection = (props: Partial<THandleDraw>) => {
  const { ctx, pixelSize, x, y } = props

  const imageData = ctx!.getImageData(x!, y!, pixelSize!, pixelSize!)
  const data = imageData.data
  let isTransparent = true

  for (let i = 3; i < data.length; i += 4) {
    if (data[i] !== 0) {
      isTransparent = false
      break
    }
  }

  return isTransparent
}

export function handleInvertDrawPixel(props: THandleDraw) {
  const { pixelColor, ctx, pixelOpacity, pixelSize, x, xMirror, y, yMirror } = props
  const { width, height } = ctx.canvas
  const mirroredX = width - x - pixelSize
  const mirroredY = height - y - pixelSize
  if (x === lastX && y === lastY) return
  lastX = x
  lastY = y

  const isTransparent = transparentSection(props)

  if (!isTransparent) {
    if (xMirror) ctx.clearRect(mirroredX, y, pixelSize, pixelSize)
    if (yMirror) ctx.clearRect(x, mirroredY, pixelSize, pixelSize)
    if (xMirror && yMirror) ctx.clearRect(mirroredX, mirroredY, pixelSize, pixelSize)
    return ctx.clearRect(x, y, pixelSize, pixelSize)
  }

  ctx.beginPath()
  ctx.imageSmoothingEnabled = false
  ctx.globalAlpha = pixelOpacity
  ctx.fillStyle = pixelColor

  ctx.fillRect(x, y, pixelSize, pixelSize)
  if (xMirror) ctx.fillRect(mirroredX, y, pixelSize, pixelSize)
  if (yMirror) ctx.fillRect(x, mirroredY, pixelSize, pixelSize)
  if (xMirror && yMirror) ctx.fillRect(mirroredX, mirroredY, pixelSize, pixelSize)
  ctx.closePath()
}

export function handleDrawPixel(props: THandleDraw) {
  const { pixelColor, ctx, pixelOpacity, pixelSize, x, xMirror, y, yMirror } = props
  const { width, height } = ctx.canvas
  const mirroredX = width - x - pixelSize
  const mirroredY = height - y - pixelSize

  const alignedX = Math.floor(x)
  const alignedY = Math.floor(y)

  ctx.beginPath()
  ctx.imageSmoothingEnabled = false
  ctx.globalAlpha = pixelOpacity
  ctx.fillStyle = pixelColor
  ctx.fillRect(alignedX, alignedY, pixelSize, pixelSize)
  if (xMirror) ctx.fillRect(mirroredX, y, pixelSize, pixelSize)
  if (yMirror) ctx.fillRect(x, mirroredY, pixelSize, pixelSize)
  if (xMirror && yMirror) ctx.fillRect(mirroredX, mirroredY, pixelSize, pixelSize)
  ctx.closePath()
}

export function HandleDeletePixel({ ctx, pixelSize, x, y, xMirror, yMirror }: HandleMirrorTool) {
  const { width, height } = ctx.canvas
  const mirroredX = width - x - pixelSize
  const mirroredY = height - y - pixelSize
  ctx.clearRect(x, y, pixelSize, pixelSize)
  if (xMirror) ctx.clearRect(mirroredX, y, pixelSize, pixelSize)
  if (yMirror) ctx.clearRect(x, mirroredY, pixelSize, pixelSize)
  if (xMirror && yMirror) ctx.clearRect(mirroredX, mirroredY, pixelSize, pixelSize)
}

export const handleClearCanvas = (ctx: CanvasRenderingContext2D) => {
  const { width, height } = ctx.canvas
  ctx.clearRect(0, 0, width, height)
}

export function handleDither({ ctx, x, y, pixelSize, xMirror, yMirror }: THandleDraw) {
  const imageData = ctx.getImageData(x, y, pixelSize, pixelSize)
  const { width, height } = ctx.canvas
  const mirroredX = width - x - pixelSize
  const mirroredY = height - y - pixelSize

  const factor = 1 / 16
  const matrix = [
    [0, 8, 2, 10],
    [12, 4, 14, 6],
    [3, 11, 1, 9],
    [15, 7, 13, 5]
  ]

  for (let py = 0; py < pixelSize; py++) {
    for (let px = 0; px < pixelSize; px++) {
      const index = (py * pixelSize + px) * 4

      const oldR = imageData.data[index]
      const oldG = imageData.data[index + 1]
      const oldB = imageData.data[index + 2]

      const newR = Math.round(oldR / 32) * 32
      const newG = Math.round(oldG / 32) * 32
      const newB = Math.round(oldB / 32) * 32

      imageData.data[index] = newR
      imageData.data[index + 1] = newG
      imageData.data[index + 2] = newB

      const errR = oldR - newR
      const errG = oldG - newG
      const errB = oldB - newB

      const matrixValue = matrix[py % 4][px % 4]
      const diffusion = factor * matrixValue

      if (px < pixelSize - 1) {
        imageData.data[index + 4] += errR * diffusion
        imageData.data[index + 5] += errG * diffusion
        imageData.data[index + 6] += errB * diffusion
      }
      if (py < pixelSize - 1) {
        imageData.data[index + pixelSize * 4] += errR * diffusion
        imageData.data[index + pixelSize * 4 + 1] += errG * diffusion
        imageData.data[index + pixelSize * 4 + 2] += errB * diffusion
      }
    }
  }

  ctx.putImageData(imageData, x, y)

  if (xMirror) {
    ctx.putImageData(imageData, mirroredX, y)
  }
  if (yMirror) {
    ctx.putImageData(imageData, x, mirroredY)
  }
  if (xMirror && yMirror) {
    ctx.putImageData(imageData, mirroredX, mirroredY)
  }
}

export function moveDraw(ctx: CanvasRenderingContext2D, dx: number, dy: number) {
  const { width, height } = ctx.canvas
  const imageData = ctx.getImageData(0, 0, width, height)
  ctx.clearRect(0, 0, width, height)
  ctx.putImageData(imageData, dx, dy)
}

const offscreenCanvas = new OffscreenCanvas(0, 0)
const offscreenCtx = offscreenCanvas.getContext('2d')!

export function moveDraw2(ctx: CanvasRenderingContext2D, dx: number, dy: number) {
  const { width, height } = ctx.canvas

  offscreenCanvas.width = width * 2
  offscreenCanvas.height = height * 2

  offscreenCtx.clearRect(0, 0, offscreenCanvas.width, offscreenCanvas.height)
  ctx.clearRect(0, 0, width, height)

  offscreenCtx.drawImage(ctx.canvas, (width * 2) / 2 - width / 2, (width * 2) / 2 - width / 2)

  const imageData = offscreenCtx.getImageData(0, 0, (width * 2) / 2 - width / 2, (width * 2) / 2 - width / 2)
  offscreenCtx.putImageData(imageData, dx, dy)

  ctx.drawImage(offscreenCanvas, dx, dy, width, height, 0, 0, width, height)
}

export function moveFrameDraw(layerId: string, dx: number, dy: number) {
  const $frameElement = document.getElementById(layerId)
  if (!($frameElement instanceof HTMLElement)) return
  const $layers = $frameElement.querySelectorAll('canvas')

  $layers.forEach($layer => {
    const ctx = $layer.getContext('2d', { willReadFrequently: true })
    if (!ctx) return
    moveDraw(ctx, dx, dy)
  })
}
