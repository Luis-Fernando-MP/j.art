export enum TransformWorker {
  CENTER = 'center',
  CROP = 'crop',
  FULL_CROP = 'fullCrop'
}
export interface TransformWorkerMessage {
  bitmap?: ImageBitmap
  bitmaps?: ImageBitmap[]
  action?: TransformWorker
  pixelSize?: number
}
export type WorkerEvent = MessageEvent<TransformWorkerMessage>

self.onmessage = async (event: WorkerEvent) => {
  const { bitmap, action, pixelSize, bitmaps } = event.data
  try {
    if (!action) throw new Error('No action provided')
    if (action === TransformWorker.CENTER && bitmap && pixelSize) await handleCenterImage(bitmap, pixelSize)
    if (action === TransformWorker.CROP && bitmap) await handleCropImage(bitmap)
    if (action === TransformWorker.FULL_CROP && bitmaps) await handleFullCropImage(bitmaps)
  } catch (error) {
    self.postMessage({ error: (error as Error)?.message })
  }
}

const tempOffscreen = new OffscreenCanvas(0, 0)
const tempCtx = tempOffscreen.getContext('2d')!

async function handleCenterImage(bitmap: ImageBitmap, pixelSize: number) {
  const { height, width } = bitmap
  const offscreen = new OffscreenCanvas(width, height)
  const ctx = offscreen.getContext('2d')
  if (!ctx) throw new Error('Failed to get 2D context')

  ctx.drawImage(bitmap, 0, 0)

  try {
    const imageData = ctx.getImageData(0, 0, width, height)

    let minX = width
    let minY = height
    let maxX = 0
    let maxY = 0
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

    if (!hasContent) throw new Error('No content provided')

    const drawingWidth = maxX - minX + 1
    const drawingHeight = maxY - minY + 1

    const offsetX = Math.round((width - drawingWidth) / 2 / pixelSize) * pixelSize
    const offsetY = Math.round((height - drawingHeight) / 2 / pixelSize) * pixelSize

    tempOffscreen.width = drawingWidth
    tempOffscreen.height = drawingHeight
    const croppedImageData = ctx.getImageData(minX, minY, drawingWidth, drawingHeight)
    tempCtx.putImageData(croppedImageData, 0, 0)

    ctx.clearRect(0, 0, width, height)
    ctx.drawImage(tempOffscreen, offsetX, offsetY)

    const updatedBitmap = await createImageBitmap(offscreen)
    self.postMessage({ bitmap: updatedBitmap })
  } catch (error) {
    throw new Error((error as Error)?.message)
  }
}

function cropImageFromBitmap(bitmap: ImageBitmap, ctx: OffscreenCanvasRenderingContext2D) {
  const { height, width } = bitmap
  const imageData = ctx.getImageData(0, 0, width, height)
  const data = imageData.data

  let left = width
  let right = 0
  let top = height
  let bottom = 0

  try {
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const index = (y * width + x) * 4
        // Pixel is not transparent
        if (data[index + 3] > 0) {
          if (x < left) left = x
          if (x > right) right = x
          if (y < top) top = y
          if (y > bottom) bottom = y
        }
      }
    }

    const newWidth = right - left + 1
    const newHeight = bottom - top + 1

    return { width: newWidth, height: newHeight, left, top, right, bottom }
  } catch (error) {
    return null
  }
}

async function handleCropImage(bitmap: ImageBitmap) {
  const { height, width } = bitmap
  const offscreen = new OffscreenCanvas(width, height)
  const ctx = offscreen.getContext('2d')
  if (!ctx) throw new Error('Failed to get 2D context')

  ctx.drawImage(bitmap, 0, 0)
  const imageData = ctx.getImageData(0, 0, width, height)
  const data = imageData.data

  let left = width
  let right = 0
  let top = height
  let bottom = 0

  try {
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const index = (y * width + x) * 4
        // Pixel is not transparent
        if (data[index + 3] > 0) {
          if (x < left) left = x
          if (x > right) right = x
          if (y < top) top = y
          if (y > bottom) bottom = y
        }
      }
    }

    const newWidth = right - left + 1
    const newHeight = bottom - top + 1

    const finalOffscreen = new OffscreenCanvas(newWidth, newHeight)
    const finalCtx = finalOffscreen.getContext('2d')
    if (!finalCtx) throw new Error('Failed to get 2D context for final offscreen canvas')

    finalCtx.drawImage(offscreen, left, top, newWidth, newHeight, 0, 0, newWidth, newHeight)

    const updatedBitmap = await createImageBitmap(finalOffscreen)
    self.postMessage({ bitmap: updatedBitmap, width: newWidth, height: newHeight })
  } catch (error) {
    console.error('Error during image cropping:', error)
    throw new Error((error as Error)?.message || 'Unknown error during image cropping')
  }
}

async function handleFullCropImage(bitmaps: ImageBitmap[]) {
  if (bitmaps.length === 0) throw new Error('No images provided')
  const maxWidth = Math.max(...bitmaps.map(img => img.width))
  const maxHeight = Math.max(...bitmaps.map(img => img.height))

  const offscreen = new OffscreenCanvas(maxWidth, maxHeight)
  const ctx = offscreen.getContext('2d')
  if (!ctx) throw new Error('Failed to get 2D context')

  bitmaps.forEach(bitmap => ctx.drawImage(bitmap, 0, 0))

  const bitmap = await createImageBitmap(offscreen)

  const isCropped = cropImageFromBitmap(bitmap, ctx)
  if (!isCropped) throw new Error('No content provided')

  self.postMessage(isCropped)
}
