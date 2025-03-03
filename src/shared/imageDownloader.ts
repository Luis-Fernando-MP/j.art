import { Frame, LayerFile } from '@/app/(current)/components/CanvasFile/artFile.type'
import { Layer } from '@/app/(current)/store/layer.store'
import { EDowImageWk } from '@workers/downloadImage'
// @ts-ignore
import GIF from 'gif.js.optimized'
import toast from 'react-hot-toast'

import { getBitmapFromParentCanvas } from './bitmap'
import { handleWorkerMessage } from './handleWorkerMessage'

interface IDownload {
  frameId: string
  width: number
  height: number
  title: string
  scale?: number
  worker: Worker
}

export const frameToPng = async ({ frameId, width, height, title, scale = 1, worker }: IDownload) => {
  const toastId = 'gifDownload'
  toast.loading('🍀 Procesando', { id: toastId })
  const imagesBitmap = await getBitmapFromParentCanvas(frameId, scale, width, height)
  if (!imagesBitmap) return toast.dismiss(toastId)

  try {
    const message = { imagesBitmap, action: EDowImageWk.TO_PNG }
    worker.postMessage(message, imagesBitmap)
    handleWorkerMessage(worker, data => {
      const { blob } = data
      if (!blob) return toast.error('❌ Algo ha salido mal', { id: toastId })

      toast.success('🚀 Listo!!', { id: toastId })
      const downloadLink = document.createElement('a')
      downloadLink.href = URL.createObjectURL(blob)
      downloadLink.download = `${title}.png`
      downloadLink.click()
    })
  } catch (error) {
    toast.dismiss(toastId)
    console.error('Failed to create ImageBitmap for layer view:', error)
  }
}

interface IDrawToGif {
  width: number
  height: number
  title: string
  scale?: number
  listOfLayers: {
    [key: string]: Layer[]
  }
}
export const drawToGif = (props: IDrawToGif) => {
  const { width, height, title, scale = 1, listOfLayers } = props
  const toastId = 'gifDownload'
  toast.loading('🍀 Procesando', { id: toastId })

  const gif = new GIF({
    workers: 3,
    quality: 10,
    workerScript: '/workers/gif/gif.worker.js'
  })

  const frames = Object.keys(listOfLayers).map(frameKey => {
    const $canvas = document.createElement('canvas')
    $canvas.width = width * scale
    $canvas.height = height * scale
    const ctx = $canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, $canvas.width, $canvas.height)

    listOfLayers[frameKey].toReversed().forEach(layer => {
      const canvas = document.getElementById(layer.id) as HTMLCanvasElement
      if (!canvas) return

      const computedStyle = window.getComputedStyle(canvas)
      const { opacity, filter } = computedStyle

      ctx.globalAlpha = Number(opacity) || 1
      if (filter !== 'none') {
        ctx.filter = filter
      }

      ctx.drawImage(canvas, 0, 0, width * scale, height * scale)
    })
    return $canvas
  })

  frames.forEach(frame => {
    if (frame) {
      gif.addFrame(frame, { delay: 200 })
    }
  })

  gif.on('finished', (blob: Blob) => {
    const downloadLink = document.createElement('a')
    downloadLink.href = URL.createObjectURL(blob)
    downloadLink.download = `${title}.gif`
    downloadLink.click()

    toast.success('🚀 Listo!!', { id: toastId })
  })

  gif.render()
}

interface IFileArtObject {
  listOfLayers: {
    [key: string]: Layer[]
  }
  width: number
  height: number
  title: string
  actFrameId: string
  actFrameIndex: number
  actLayerId: string
}

export const toFileArt = (props: IFileArtObject) => {
  const { listOfLayers, width, height, title, actFrameId, actFrameIndex, actLayerId } = props

  const parentEntries = Object.entries(listOfLayers)

  let frames: Frame[] = []

  parentEntries.forEach(item => {
    const [frameKey, layers] = item
    const $frameElement = document.getElementById(frameKey)
    if (!$frameElement) return

    let layersObj: LayerFile[] = []

    for (const layer of layers) {
      const $layerElement = document.getElementById(layer.id)
      if (!($layerElement instanceof HTMLCanvasElement)) continue

      layersObj.push({
        id: layer.id,
        title: layer.title,
        parentId: layer.parentId,
        imageUrl: layer.imageUrl,
        canvasUrl: $layerElement.toDataURL('image/png'),
        isWatching: layer.isWatching,
        filters: {
          opacity: layer.opacity,
          hue: layer.hue
        }
      })
    }

    frames.push({
      speed: 100,
      id: frameKey,
      layers: layersObj
    })
  })

  const artFile = {
    website: 'j-art.vercel.app',
    extension: '.art',
    author: 'shuli dev',
    contact: 'luigfmp@gmail.com',
    width: width,
    height: height,
    title: title,
    created_at: Date.now(),
    updated_at: Date.now(),
    actFrameId,
    actFrameIndex,
    actLayerId,
    frames
  }

  const jsonBlob = new Blob([JSON.stringify(artFile)], { type: 'application/json' })
  const downloadLink = document.createElement('a')
  downloadLink.href = URL.createObjectURL(jsonBlob)
  downloadLink.download = `${title}.art`
  downloadLink.click()
}
