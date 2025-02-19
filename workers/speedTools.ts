import { handlePaintBucket } from './scriptTools'

export enum EToolsWorker {
  BUCKET = 'bucket'
}
export interface ToolsWorkerMessage {
  bitmap?: ImageBitmap
  action?: EToolsWorker
  startX?: number
  startY?: number
  fillColor?: string
}
export type WorkerEvent = MessageEvent<ToolsWorkerMessage>

const validEverything = (...values: any[]) => values.every(i => !!i)

self.onmessage = async (event: WorkerEvent) => {
  const { action, bitmap, startX, startY, fillColor } = event.data

  self.postMessage({ action, bitmap, startX, startY, fillColor })
}

self.onerror = function (event) {
  console.error('Error en el worker:', event)
}

const handlePaintCanvas = async (bitmap: ImageBitmap, startX: number, startY: number, fillColor: string) => {
  const { height, width } = bitmap
  const offscreen = new OffscreenCanvas(width, height)
  const ctx = offscreen.getContext('2d')
  if (!ctx) throw new Error('Failed to get 2D context')

  ctx.drawImage(bitmap, 0, 0)

  try {
    handlePaintBucket(ctx, startX, startY, fillColor)

    const updatedBitmap = await createImageBitmap(offscreen)
    self.postMessage({ bitmap: updatedBitmap })
  } catch (error) {
    throw new Error((error as Error)?.message)
  }
}
