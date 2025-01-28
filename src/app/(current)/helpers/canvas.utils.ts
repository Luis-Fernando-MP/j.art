'use client'

const tempCanvas = document.createElement('canvas')
const tempCtx = tempCanvas.getContext('2d')!
tempCtx.imageSmoothingEnabled = false

export const getContext = (id: string = 'canvas') => {
  const canvas = document.getElementById(id)
  if (!(canvas instanceof HTMLCanvasElement)) throw new Error('canvas element is undefined')
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('context is undefined')
  return { canvas, ctx }
}

export function changeBrushSize(size: number) {
  const $canvasGrid = document.getElementById('canvas-grid')
  if (!($canvasGrid instanceof HTMLElement)) return null
  $canvasGrid.style.setProperty('--s-grid', `${size}px`)
}

export function rotateCanvas(ctx: CanvasRenderingContext2D, deg: number) {
  const { width, height } = ctx.canvas

  tempCanvas.width = width
  tempCanvas.height = height
  tempCtx.drawImage(ctx.canvas, 0, 0)

  const rad = (deg * Math.PI) / 180

  ctx.imageSmoothingEnabled = false
  ctx.clearRect(0, 0, width, height)
  ctx.save()
  ctx.translate(width / 2, height / 2)
  ctx.rotate(rad)
  ctx.translate(-width / 2, -height / 2)
  ctx.drawImage(tempCanvas, 0, 0, width, height)
  ctx.restore()
  tempCtx.clearRect(0, 0, width, height)
}

export function flipHorizontal(ctx: CanvasRenderingContext2D) {
  const { width, height } = ctx.canvas
  tempCanvas.width = width
  tempCanvas.height = height
  tempCtx.drawImage(ctx.canvas, 0, 0)

  ctx.imageSmoothingEnabled = false
  ctx.clearRect(0, 0, width, height)
  ctx.save()
  ctx.translate(width, 0)
  ctx.scale(-1, 1)
  ctx.drawImage(tempCanvas, 0, 0, width, height)
  ctx.restore()

  tempCtx.clearRect(0, 0, width, height)
}

export function flipVertical(ctx: CanvasRenderingContext2D) {
  const { width, height } = ctx.canvas
  tempCanvas.width = width
  tempCanvas.height = height
  tempCtx.drawImage(ctx.canvas, 0, 0)

  ctx.imageSmoothingEnabled = false
  ctx.clearRect(0, 0, width, height)
  ctx.save()
  ctx.translate(0, height)
  ctx.scale(1, -1)
  ctx.drawImage(tempCanvas, 0, 0, width, height)
  ctx.restore()

  tempCtx.clearRect(0, 0, width, height)
}
export function centerCanvasContent(ctx: CanvasRenderingContext2D, pixelSize: number = 30) {
  const { width, height } = ctx.canvas
  const imageData = ctx.getImageData(0, 0, width, height)

  let minX = width
  let minY = height
  let maxX = 0
  let maxY = 0
  let hasContent = false

  // Buscar los límites del contenido en el canvas
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const index = (y * width + x) * 4
      if (imageData.data[index + 3] !== 0) {
        minX = Math.min(minX, x)
        minY = Math.min(minY, y)
        maxX = Math.max(maxX, x)
        maxY = Math.max(maxY, y)
        hasContent = true
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
  ctx.drawImage(
    tempCanvas,
    0,
    0,
    drawingWidth,
    drawingHeight,
    offsetX,
    offsetY,
    drawingWidth,
    drawingHeight
  )
  tempCtx.clearRect(0, 0, width, height)
}
