import toast from 'react-hot-toast'

const tmpCanvas = new OffscreenCanvas(0, 0)
const tmpCtx = tmpCanvas.getContext('2d')!

export const getBitmapFromCanvas = async (canvasId: string) => {
  const canvas = document.getElementById(canvasId) as HTMLCanvasElement
  if (!canvas) {
    toast.error('❌ El lienzo actual no existe')
    return
  }

  const computedStyle = window.getComputedStyle(canvas)
  const { opacity, filter } = computedStyle
  let canvasOpacity = Number(opacity) || 1

  tmpCanvas.width = canvas.width
  tmpCanvas.height = canvas.height
  tmpCtx.imageSmoothingEnabled = false

  tmpCtx.globalAlpha = canvasOpacity
  tmpCtx.filter = filter

  tmpCtx.drawImage(canvas, 0, 0)
  return createImageBitmap(tmpCanvas)
}

export const getBitmapFromParentCanvas = async (elementId: string, scale: number = 1, w?: number, h?: number) => {
  const container = document.getElementById(elementId)
  if (!container) {
    toast.error('❌ El contenedor padre no existe')
    return
  }
  const listOfCanvas = Array.from(container.querySelectorAll('canvas'))
  const imageBitmaps: Promise<ImageBitmap>[] = []

  for (const canvas of listOfCanvas) {
    const computedStyle = window.getComputedStyle(canvas)
    const { opacity, display, filter } = computedStyle

    const width = w ?? canvas.width
    const height = h ?? canvas.height

    let canvasOpacity = Number(opacity) || 1
    if (display === 'none') canvasOpacity = 0

    tmpCanvas.width = width * scale
    tmpCanvas.height = height * scale

    tmpCtx.imageSmoothingEnabled = false
    tmpCtx.globalAlpha = canvasOpacity
    tmpCtx.filter = filter

    tmpCtx.drawImage(canvas, 0, 0, width * scale, height * scale)
    const bitmapPromise = createImageBitmap(tmpCanvas)
    imageBitmaps.push(bitmapPromise)
  }

  return await Promise.all(imageBitmaps)
}

export const getOnlyBitmapFromParent = async (elementId: string, scale: number = 1, w?: number, h?: number) => {
  const container = document.getElementById(elementId)
  if (!container) {
    toast.error('❌ El contenedor padre no existe')
    return
  }
  const listOfCanvas = Array.from(container.querySelectorAll('canvas'))
  const imageBitmaps: Promise<ImageBitmap>[] = []

  for (const canvas of listOfCanvas) {
    // const computedStyle = window.getComputedStyle(canvas)
    // const { opacity, display, filter } = computedStyle

    const width = w ?? canvas.width
    const height = h ?? canvas.height

    // let canvasOpacity = Number(opacity) || 1
    // if (display === 'none') canvasOpacity = 0

    tmpCanvas.width = width * scale
    tmpCanvas.height = height * scale

    tmpCtx.imageSmoothingEnabled = false
    tmpCtx.globalAlpha = 1
    tmpCtx.filter = 'none'

    tmpCtx.drawImage(canvas, 0, 0, width * scale, height * scale)
    const bitmapPromise = createImageBitmap(tmpCanvas)
    imageBitmaps.push(bitmapPromise)
  }

  return await Promise.all(imageBitmaps)
}
