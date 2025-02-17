import toast from 'react-hot-toast'

export const getBitmapFromCanvas = async (canvasId: string) => {
  const canvas = document.getElementById(canvasId) as HTMLCanvasElement
  if (!canvas) {
    toast.error('❌ El lienzo actual no existe')
    return
  }
  const computedStyle = window.getComputedStyle(canvas)
  let opacity = Number(computedStyle.opacity) || 1
  const offscreen = new OffscreenCanvas(canvas.width, canvas.height)
  const ctx = offscreen.getContext('2d')
  if (!ctx) return
  ctx.globalAlpha = opacity
  ctx.drawImage(canvas, 0, 0)
  return createImageBitmap(offscreen)
}

export const getBitmapFromParentCanvas = async (elementId: string) => {
  const container = document.getElementById(elementId)
  if (!container) {
    toast.error('❌ El contenedor padre no existe')
    return
  }
  const listOfCanvas = Array.from(container.querySelectorAll('canvas'))
  const imageBitmaps: Promise<ImageBitmap>[] = []

  for (const canvas of listOfCanvas) {
    const computedStyle = window.getComputedStyle(canvas)
    const display = computedStyle.display
    let opacity = Number(computedStyle.opacity) || 1
    if (display === 'none') opacity = 0
    const offscreen = new OffscreenCanvas(canvas.width, canvas.height)
    const ctx = offscreen.getContext('2d')
    if (!ctx) continue
    ctx.globalAlpha = opacity
    ctx.drawImage(canvas, 0, 0)
    const bitmapPromise = createImageBitmap(offscreen)
    imageBitmaps.push(bitmapPromise)
  }

  return await Promise.all(imageBitmaps)
}
