import { EToolsWorker, WorkerEvent } from './speedTools.types.js'
import { handlePaintBucket, handlePipetteColor } from './utils.js'

const validEverything = (...values: any[]) => values.every(i => !!i)

self.onmessage = async (event: WorkerEvent) => {
  const { action, bitmap, startX, startY, fillColor } = event.data

  try {
    if (!action) throw new Error('No action provided')

    if (action === EToolsWorker.BUCKET && validEverything([bitmap, startX, startY, fillColor]))
      await paintBucketCanvas(bitmap!, startX!, startY!, fillColor!)

    if (action === EToolsWorker.PIPETTE && validEverything([bitmap, startX, startY]))
      await pipetteCanvasColor(bitmap!, startX!, startY!)
  } catch (error) {
    self.postMessage({ error: (error as Error)?.message })
  }
}

const paintBucketCanvas = async (bitmap: ImageBitmap, startX: number, startY: number, fillColor: string) => {
  const { height, width } = bitmap
  const offscreen = new OffscreenCanvas(width, height)
  const ctx = offscreen.getContext('2d')

  try {
    if (!ctx) throw new Error('Failed to get 2D context')
    ctx.drawImage(bitmap, 0, 0)
    const warning = handlePaintBucket(ctx, startX, startY, fillColor)
    if (warning) return self.postMessage({ warning: warning.message })
    const updatedBitmap = await createImageBitmap(offscreen)
    self.postMessage({ bitmap: updatedBitmap })
  } catch (error) {
    throw new Error((error as Error)?.message)
  }
}

const pipetteCanvasColor = async (bitmap: ImageBitmap, startX: number, startY: number) => {
  const { height, width } = bitmap
  const offscreen = new OffscreenCanvas(width, height)
  const ctx = offscreen.getContext('2d')

  try {
    if (!ctx) throw new Error('Failed to get 2D context')
    ctx.drawImage(bitmap, 0, 0)
    const rgba = handlePipetteColor(ctx, startX, startY).rgba
    self.postMessage({ rgba })
  } catch (error) {
    throw new Error((error as Error)?.message)
  }
}
