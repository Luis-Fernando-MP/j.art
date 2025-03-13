import { flipHorizontal, flipVertical, getContext, rotateCanvas } from '@/scripts/transformCanvas'
import { getBitmapFromParentCanvas } from '@/shared/bitmap'
import { handleWorkerMessage } from '@/shared/handleWorkerMessage'
import { TransformWorker, TransformWorkerMessage } from '@workers/transform'
import { AlignCenterVerticalIcon, CropIcon, FlipHorizontalIcon, FlipVerticalIcon, Rotate3DIcon, ShrinkIcon } from 'lucide-react'
import { type JSX, useEffect, useRef } from 'react'
import toast from 'react-hot-toast'

import ActiveDrawsStore from '../../store/ActiveDraws.store'
import CanvasStore from '../../store/canvas.store'
import PixelStore from '../../store/pixel.store'
import RepaintDrawingStore from '../../store/repaintDrawing.store'
import MirrorTools from './MirrorTools'

const tmpCanvas = new OffscreenCanvas(100, 100)
const tmpCtx = tmpCanvas.getContext('2d')!

const UtilityTools = (): JSX.Element | null => {
  const { pixelSize } = PixelStore()
  const { actLayerId, actParentId } = ActiveDrawsStore()
  const { setRepaint, fullRepaint } = RepaintDrawingStore()
  const { setDimensions } = CanvasStore()

  const transformWorkerRef = useRef<Worker | null>(null)

  useEffect(() => {
    transformWorkerRef.current = new Worker(/* turbopackIgnore: true */ '/workers/transform.js', { type: 'module' })
    return () => {
      transformWorkerRef.current?.terminate()
    }
  }, [])

  const handleHorizontalFlip = () => {
    const currentCanvas = getContext(actLayerId)
    if (!currentCanvas) return
    flipHorizontal(currentCanvas.ctx)
    setRepaint('all')
  }

  const handleVerticalFlip = () => {
    const currentCanvas = getContext(actLayerId)
    if (!currentCanvas) return
    flipVertical(currentCanvas.ctx)
    setRepaint('all')
  }

  const handleRotate = () => {
    const currentCanvas = getContext(actLayerId)
    if (!currentCanvas) return
    rotateCanvas(currentCanvas.ctx, 90)
    setRepaint('all')
  }

  const handleCenterDraw = async () => {
    const currentCanvas = getContext(actLayerId)
    if (!transformWorkerRef.current || !currentCanvas) return
    const { canvas, ctx } = currentCanvas

    try {
      const bitmap = await createImageBitmap(canvas)
      const message: TransformWorkerMessage = {
        bitmap,
        action: TransformWorker.CENTER,
        pixelSize
      }
      transformWorkerRef.current.postMessage(message, [bitmap])
    } catch (error) {
      console.log(error)
    }

    handleWorkerMessage(transformWorkerRef.current, data => {
      const { bitmap } = data
      ctx.clearRect(0, 0, bitmap.width, bitmap.height)
      ctx.drawImage(bitmap, 0, 0)
      setRepaint('all')
    })
  }

  const handleCrop = async () => {
    const currentCanvas = getContext(actLayerId)
    if (!currentCanvas) return
    const { canvas, ctx } = currentCanvas

    try {
      if (!transformWorkerRef.current) return toast.error('No se ha podido crear el worker 🤔')

      const bitmap = await createImageBitmap(canvas)
      const message: TransformWorkerMessage = {
        bitmap,
        action: TransformWorker.CROP
      }
      transformWorkerRef.current.postMessage(message, [bitmap])
    } catch (error) {
      console.log(error)
    }

    handleWorkerMessage(transformWorkerRef.current, data => {
      const { bitmap, width, height } = data
      const { canvas } = ctx

      if (!bitmap) return toast.error('No se pudo realizar el crop 🤔')
      if (width === canvas.width && height === canvas.height) return

      ctx.clearRect(0, 0, width, height)
      canvas.width = width
      canvas.height = height
      ctx.drawImage(bitmap, 0, 0)
      setDimensions({ width, height })
      setRepaint('all')
    })
  }

  const handleFullCrop = async () => {
    try {
      if (!transformWorkerRef.current) return toast.error('No se ha podido crear el worker 🤔')
      const bitmaps = await getBitmapFromParentCanvas(actParentId)
      if (!bitmaps) return

      const message: TransformWorkerMessage = {
        bitmaps,
        action: TransformWorker.FULL_CROP
      }
      transformWorkerRef.current.postMessage(message, bitmaps)
    } catch (error) {
      toast.error('No se pudo obtener el bitmap 🤔')
    }

    handleWorkerMessage(transformWorkerRef.current, data => {
      const { width, height, left, top } = data

      fullRepaint(layer => {
        const { $canvas } = layer
        const ctx = $canvas?.getContext('2d')
        if (!$canvas || !ctx) return

        tmpCanvas.width = width
        tmpCanvas.height = height
        tmpCtx.drawImage($canvas, left, top, width, height, 0, 0, width, height)

        ctx.clearRect(0, 0, width, height)
        ctx.drawImage(tmpCanvas, 0, 0)
        setRepaint('all')
      })

      setDimensions({ width, height })
    })
  }

  return (
    <section className='utilityTools'>
      <div className='utilityTools-container'>
        <p>Flips</p>
        <div className='utilityTools-actions'>
          <button onClick={handleHorizontalFlip}>
            <FlipHorizontalIcon />
          </button>
          <button onClick={handleVerticalFlip}>
            <FlipVerticalIcon />
          </button>
        </div>
      </div>

      <div className='utilityTools-container'>
        <p>Rotar</p>
        <div className='utilityTools-actions'>
          <button onClick={handleRotate}>
            <Rotate3DIcon />
          </button>
          <button onClick={handleCenterDraw}>
            <AlignCenterVerticalIcon />
          </button>
        </div>
      </div>

      <div className='utilityTools-container'>
        <p>Mirror</p>
        <MirrorTools />
      </div>

      <div className='utilityTools-container'>
        <p>Crop</p>
        <div className='utilityTools-actions'>
          <button onClick={handleCrop}>
            <CropIcon />
          </button>
          <button onClick={handleFullCrop}>
            <ShrinkIcon />
          </button>
        </div>
      </div>
    </section>
  )
}

export default UtilityTools
