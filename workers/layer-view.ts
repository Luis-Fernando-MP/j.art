export enum EWorkerActions {
  GENERATE_FRAME = 'generateFrameView',
  GENERATE_FULL_VIEW = 'generateFullView',
  CHANGE_OPACITY = 'changeOpacity'
}
export type WorkerEvent = MessageEvent<WorkerMessage>
export interface WorkerMessage {
  imageBitmap?: ImageBitmap
  imagesBitmap?: ImageBitmap[]
  action?: EWorkerActions
  alpha?: number
}

self.onmessage = async (event: WorkerEvent) => {
  const { imageBitmap, action, imagesBitmap, alpha } = event.data
  try {
    if (!action) throw new Error('No action provided')
    if (action === EWorkerActions.GENERATE_FRAME && imageBitmap) await generateImage(imageBitmap)
    if (action === EWorkerActions.GENERATE_FULL_VIEW && imagesBitmap) await generateFullImage(imagesBitmap)

    if (action === EWorkerActions.CHANGE_OPACITY && imageBitmap && alpha) await changeAlpha(imageBitmap, alpha)
  } catch (error) {
    self.postMessage({ error: (error as Error).message })
  }
}

async function changeAlpha(imageBitmap: ImageBitmap, alpha: number) {
  const { width, height } = imageBitmap
  const offscreen = new OffscreenCanvas(width, height)
  const ctx = offscreen.getContext('2d')
  if (!ctx) throw new Error('Failed to get 2D context')

  ctx.drawImage(imageBitmap, 0, 0)
  const imageData = ctx.getImageData(0, 0, width, height)
  const data = imageData.data
  for (let i = 3; i < data.length; i += 4) {
    data[i] = data[i] * alpha
  }

  ctx.putImageData(imageData, 0, 0)

  try {
    const updatedBitmap = await createImageBitmap(offscreen)
    const blob = await offscreen.convertToBlob({
      quality: 0.05
    })
    const reader = new FileReader()

    reader.onloadend = () => {
      self.postMessage({ base64: reader.result, bitmap: updatedBitmap })
    }
    reader.readAsDataURL(blob)
  } catch (error) {
    throw new Error((error as Error)?.message)
  }
}

async function generateImage(imageBitmap: ImageBitmap) {
  const offscreen = new OffscreenCanvas(imageBitmap.width, imageBitmap.height)
  const ctx = offscreen.getContext('2d')
  if (!ctx) throw new Error('Failed to get 2D context')
  ctx.drawImage(imageBitmap, 0, 0)
  try {
    const blob = await offscreen.convertToBlob({
      quality: 0.05
    })
    const reader = new FileReader()

    reader.onloadend = () => self.postMessage({ base64: reader.result })
    reader.readAsDataURL(blob)
  } catch (error) {
    throw new Error((error as Error)?.message)
  }
}

async function generateFullImage(imagesBitmap: ImageBitmap[]) {
  if (imagesBitmap.length === 0) throw new Error('No images provided')
  const maxWidth = Math.max(...imagesBitmap.map(img => img.width))
  const maxHeight = Math.max(...imagesBitmap.map(img => img.height))

  const offscreen = new OffscreenCanvas(maxWidth, maxHeight)
  const ctx = offscreen.getContext('2d')
  if (!ctx) throw new Error('Failed to get 2D context')

  imagesBitmap.forEach(image => ctx.drawImage(image, 0, 0))
  try {
    const blob = await offscreen.convertToBlob({ quality: 0.05 })
    const mergedBitmap = await createImageBitmap(offscreen)

    const reader = new FileReader()
    reader.onloadend = () => {
      self.postMessage({ base64: reader.result, mergedBitmap })
    }
    reader.readAsDataURL(blob)
  } catch (error) {
    throw new Error((error as Error)?.message)
  }
}
