import { flipHorizontal, flipVertical, getContext, rotateCanvas } from '@/scripts/transformCanvas'
import { handleWorkerMessage } from '@/shared/handleWorkerMessage'
import { TransformWorker, TransformWorkerMessage } from '@workers/transform'
import {
  AlignCenterVerticalIcon,
  CropIcon,
  FlipHorizontal2Icon,
  FlipHorizontalIcon,
  FlipVertical2Icon,
  FlipVerticalIcon,
  Rotate3DIcon
} from 'lucide-react'
import { type JSX, useEffect, useRef } from 'react'

import ActiveDrawsStore from '../../store/ActiveDraws.store'
import PixelStore from '../../store/pixel.store'
import RepaintDrawingStore from '../../store/repaintDrawing.store'

const UtilityTools = (): JSX.Element | null => {
  const { pixelSize } = PixelStore()
  const { actLayerId } = ActiveDrawsStore()
  const { setRepaint } = RepaintDrawingStore()

  const transformWorkerRef = useRef<Worker | null>(null)

  useEffect(() => {
    transformWorkerRef.current = new Worker('/workers/transform.js', { type: 'module' })

    return () => {
      transformWorkerRef.current?.terminate()
    }
  }, [])

  const handleHorizontalFlip = () => {
    const currentCanvas = getContext(actLayerId)
    console.log('worker', transformWorkerRef.current)
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

  return (
    <section className='canvasTools-verticalOptions'>
      <div className='canvasTools-verticalOptions__container'>
        <p>Flips</p>
        <div className='canvasTools-verticalOptions__action'>
          <button onClick={handleHorizontalFlip}>
            <FlipHorizontalIcon />
          </button>
          <button onClick={handleVerticalFlip}>
            <FlipVerticalIcon />
          </button>
        </div>
      </div>

      <div className='canvasTools-verticalOptions__container'>
        <p>Rotar</p>
        <div className='canvasTools-verticalOptions__action'>
          <button onClick={handleRotate}>
            <Rotate3DIcon />
          </button>
          <button onClick={handleCenterDraw}>
            <AlignCenterVerticalIcon />
          </button>
        </div>
      </div>

      <div className='canvasTools-verticalOptions__container'>
        <p>Mirror</p>
        <div className='canvasTools-verticalOptions__action'>
          <button>
            <FlipHorizontal2Icon />
          </button>
          <button>
            <FlipVertical2Icon />
          </button>
        </div>
      </div>

      <div className='canvasTools-verticalOptions__container'>
        <p>Crop</p>
        <div className='canvasTools-verticalOptions__action'>
          <button>
            <CropIcon />
          </button>
        </div>
      </div>
    </section>
  )
}

export default UtilityTools
