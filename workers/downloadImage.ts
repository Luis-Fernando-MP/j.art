export enum EDowImageWk {
  TO_PNG = 'generateFrameView'
}

export type WorkerEvent = MessageEvent<WorkerMessage>
export interface WorkerMessage {
  imagesBitmap?: ImageBitmap[]
  action?: EDowImageWk
  alpha?: number
}

self.onmessage = async (event: WorkerEvent) => {
  const { imagesBitmap, action } = event.data
  try {
    if (!action) throw new Error('No action provided')
    if (action === EDowImageWk.TO_PNG && imagesBitmap) await generateImage(imagesBitmap)
  } catch (error) {
    self.postMessage({ error: (error as Error).message })
  }
}

async function generateImage(imagesBitmap: ImageBitmap[]) {
  if (imagesBitmap.length === 0) throw new Error('No images provided')
  const maxWidth = Math.max(...imagesBitmap.map(img => img.width))
  const maxHeight = Math.max(...imagesBitmap.map(img => img.height))

  const offscreen = new OffscreenCanvas(maxWidth, maxHeight)
  const ctx = offscreen.getContext('2d')

  try {
    if (!ctx) throw new Error('Failed to get 2D context')
    ctx.imageSmoothingEnabled = false

    imagesBitmap.forEach(image => ctx.drawImage(image, 0, 0))
    const blob = await offscreen.convertToBlob({ quality: 1 })

    self.postMessage({ blob })
  } catch (error) {
    throw new Error((error as Error)?.message)
  }
}
