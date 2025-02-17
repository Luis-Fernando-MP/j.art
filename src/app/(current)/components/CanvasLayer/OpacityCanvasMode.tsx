import Range from '@/shared/components/Range'
import { EWorkerActions, WorkerMessage } from '@workers/layer-view'
import { BlendIcon } from 'lucide-react'
import { type JSX, memo, useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'

interface IOpacityCanvasMode {
  opacity: number
  layerId: string
}

const OpacityCanvasMode = ({ opacity, layerId }: IOpacityCanvasMode): JSX.Element => {
  const [active, setActive] = useState(false)
  const [rangeOpacity, setRangeOpacity] = useState(opacity)
  const layerWorker = useRef<Worker | null>(null)

  useEffect(() => {
    if (layerWorker.current) return
    layerWorker.current = new Worker('/workers/layer-view.js', { type: 'module' })
    return () => {
      layerWorker.current?.terminate()
      layerWorker.current = null
    }
  }, [])

  const handleClick = (): void => {
    setActive(!active)
  }

  const handleChangeRange = (range: number) => {
    const $canvas = document.getElementById(layerId)
    if (!($canvas instanceof HTMLCanvasElement)) {
      return toast.error('😟 Lienzo no encontrado')
    }
    setRangeOpacity(range)
    $canvas.style.opacity = `${range}%`
  }

  const handleFinalChangeRange = async (alpha: number) => {
    const $canvas = document.getElementById(layerId)
    console.log('pass', alpha)
    if (!($canvas instanceof HTMLCanvasElement)) return toast.error('😟 Lienzo no encontrado')
    $canvas.style.opacity = `${100}%`
    if (!layerWorker.current) return
    const ctx = $canvas.getContext('2d')
    if (!ctx) return
    try {
      const imageBitmap = await createImageBitmap($canvas)
      const message: WorkerMessage = { imageBitmap, action: EWorkerActions.CHANGE_OPACITY, alpha: alpha / 100 }

      layerWorker.current.postMessage(message, [imageBitmap])
      layerWorker.current.onmessage = event => {
        const { bitmap } = event.data
        if (!bitmap) return
        ctx.clearRect(0, 0, $canvas.width, $canvas.height)
        ctx.drawImage(bitmap, 0, 0)
      }
      layerWorker.current.onerror = error => {
        console.error('Worker Error:', error)
      }
    } catch (error) {
      console.error('Failed to create ImageBitmap:', error)
    }
  }

  return (
    <>
      <button className='canvasLayer-delete' onClick={handleClick}>
        <BlendIcon />
      </button>
      {active && (
        <div className='canvasLayer-opacityController'>
          <p>Opacidad</p>
          <Range
            handleChange={handleChangeRange}
            rangeValue={rangeOpacity}
            typeRange='horizontal'
            handleMouseUp={handleFinalChangeRange}
          />
        </div>
      )}
    </>
  )
}

export default memo(OpacityCanvasMode)
