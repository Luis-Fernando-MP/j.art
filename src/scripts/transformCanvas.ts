'use client'

import toast from 'react-hot-toast'

const tempCanvas = document.createElement('canvas')
const tempCtx = tempCanvas.getContext('2d')!

export const getContext = (id: string = 'canvas') => {
  const canvas = document.getElementById(id) as HTMLCanvasElement
  const ctx = canvas?.getContext('2d')
  if (!(canvas instanceof HTMLCanvasElement) || !ctx) {
    location.reload()
    toast.error('canvas element is undefined')
    throw new Error('canvas element is undefined')
  }
  return { canvas, ctx }
}

function prepareTempCanvas(ctx: CanvasRenderingContext2D) {
  const { width, height } = ctx.canvas
  tempCanvas.width = width
  tempCanvas.height = height
  tempCtx.drawImage(ctx.canvas, 0, 0)
  ctx.imageSmoothingEnabled = false
  ctx.clearRect(0, 0, width, height)
}

export function changeBrushSize(size: number) {
  const $canvasGrid = document.getElementById('canvas-grid')
  if (!($canvasGrid instanceof HTMLElement)) return null
  $canvasGrid.style.setProperty('--s-grid', `${size}px`)
}

export function rotateCanvas(ctx: CanvasRenderingContext2D, deg: number) {
  prepareTempCanvas(ctx)
  const { width, height } = ctx.canvas
  const rad = (deg * Math.PI) / 180
  ctx.save()
  ctx.translate(width / 2, height / 2)
  ctx.rotate(rad)
  ctx.translate(-width / 2, -height / 2)
  ctx.drawImage(tempCanvas, 0, 0, width, height)
  ctx.restore()
}

export function flipHorizontal(ctx: CanvasRenderingContext2D) {
  prepareTempCanvas(ctx)
  ctx.save()
  ctx.translate(ctx.canvas.width, 0)
  ctx.scale(-1, 1)
  ctx.drawImage(tempCanvas, 0, 0, ctx.canvas.width, ctx.canvas.height)
  ctx.restore()
  tempCtx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
}

export function flipVertical(ctx: CanvasRenderingContext2D) {
  prepareTempCanvas(ctx)
  ctx.save()
  ctx.translate(0, ctx.canvas.height)
  ctx.scale(1, -1)
  ctx.drawImage(tempCanvas, 0, 0, ctx.canvas.width, ctx.canvas.height)
  ctx.restore()
  tempCtx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
}

export function centerCanvasContent(ctx: CanvasRenderingContext2D, pixelSize: number = 30) {
  const { width, height } = ctx.canvas
  const imageData = ctx.getImageData(0, 0, width, height)
  ctx.imageSmoothingEnabled = false

  let minX = width,
    minY = height,
    maxX = 0,
    maxY = 0
  let hasContent = false

  for (let i = 3; i < imageData.data.length; i += 4) {
    if (imageData.data[i] !== 0) {
      // Canal alfa > 0 significa que hay contenido
      const pixelIndex = i / 4 // Índice del píxel en 1D
      const x = pixelIndex % width
      const y = Math.floor(pixelIndex / width)
      if (!hasContent) {
        // Si encontramos el primer píxel
        minX = maxX = x
        minY = maxY = y
        hasContent = true
      } else {
        minX = Math.min(minX, x)
        minY = Math.min(minY, y)
        maxX = Math.max(maxX, x)
        maxY = Math.max(maxY, y)
      }
    }
  }
  if (!hasContent) return
  const drawingWidth = maxX - minX + 1
  const drawingHeight = maxY - minY + 1
  const offsetX = Math.round((width - drawingWidth) / 2 / pixelSize) * pixelSize
  const offsetY = Math.round((height - drawingHeight) / 2 / pixelSize) * pixelSize

  tempCanvas.width = drawingWidth
  tempCanvas.height = drawingHeight
  const croppedImageData = ctx.getImageData(minX, minY, drawingWidth, drawingHeight)
  tempCtx.putImageData(croppedImageData, 0, 0)

  ctx.clearRect(0, 0, width, height)
  ctx.drawImage(tempCanvas, 0, 0, drawingWidth, drawingHeight, offsetX, offsetY, drawingWidth, drawingHeight)
}
