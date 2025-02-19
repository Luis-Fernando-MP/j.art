export enum TransformWorker {
  CENTER = 'center'
}
export interface TransformWorkerMessage {
  bitmap?: ImageBitmap
  action?: TransformWorker
  pixelSize?: number
}
export type WorkerEvent = MessageEvent<TransformWorkerMessage>

self.onmessage = async (event: WorkerEvent) => {
  const { bitmap, action, pixelSize } = event.data
  try {
    if (!action) throw new Error('No action provided')
    if (action === TransformWorker.CENTER && bitmap && pixelSize) await handleCenterImage(bitmap, pixelSize)
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
