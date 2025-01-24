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
