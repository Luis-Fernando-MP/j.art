import Range from '@/shared/components/Range'
import { BlendIcon } from 'lucide-react'
import { type JSX, memo, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useSessionStorage } from 'usehooks-ts'

import RepaintDrawingStore from '../../store/repaintDrawing.store'

interface IOpacityCanvasMode {
  handleOPacityChange: (opacity: number) => void
  opacity: number
  layerId: string
}

const OpacityCanvasMode = ({ opacity, layerId, handleOPacityChange }: IOpacityCanvasMode): JSX.Element => {
  const [active, setActive] = useState(false)
  const localId = `${layerId}-opacity`
  const [localOpacity, setLocalOpacity, removeLocalOpacity] = useSessionStorage(localId, opacity)

  const [rangeOpacity, setRangeOpacity] = useState(localOpacity)

  const { setRepaint } = RepaintDrawingStore()
  useEffect(() => {
    if (localOpacity === opacity) {
      removeLocalOpacity()
    }
  }, [localOpacity, opacity, removeLocalOpacity])

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
    if (!($canvas instanceof HTMLCanvasElement)) return toast.error('😟 Lienzo no encontrado')
    setLocalOpacity(alpha)
    handleOPacityChange(alpha)
    setRepaint('all')
  }

  return (
    <>
      <button className='canvasLayer-delete' onClick={handleClick}>
        <BlendIcon />
      </button>
      {active && (
        <div className='canvasLayer-opacityController'>
          <p>Opacidad {rangeOpacity}</p>
          <Range
            step={10}
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
