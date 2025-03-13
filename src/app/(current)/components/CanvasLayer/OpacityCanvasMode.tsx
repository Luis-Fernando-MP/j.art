import Range from '@/shared/components/Range'
import { BlendIcon } from 'lucide-react'
import { type JSX, memo, useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useSessionStorage } from 'usehooks-ts'

import RepaintDrawingStore from '../../store/repaintDrawing.store'

interface IOpacityCanvasMode {
  layerId: string
  opacity: number
  opacityChange: (alpha: number) => void
}

const OpacityCanvasMode = ({ layerId, opacity, opacityChange }: IOpacityCanvasMode): JSX.Element => {
  const [active, setActive] = useState(false)
  const localId = `${layerId}-opacity`
  const [localOpacity, setLocalOpacity, removeLocalOpacity] = useSessionStorage(localId, opacity)
  const [rangeOpacity, setRangeOpacity] = useState(localOpacity)
  const { setRepaint } = RepaintDrawingStore()

  useEffect(() => {
    if (localOpacity === opacity) {
      removeLocalOpacity()
    }
  }, [localOpacity, removeLocalOpacity, opacity])

  const handleClick = useCallback(() => {
    setActive(prevActive => !prevActive)
  }, [])

  const handleChangeRange = useCallback(
    (range: number) => {
      const $canvas = document.getElementById(layerId)
      if (!($canvas instanceof HTMLCanvasElement)) return toast.error('😟 Lienzo no encontrado')
      setRangeOpacity(range)
      $canvas.style.opacity = `${range}%`
    },
    [layerId]
  )

  const handleFinalChangeRange = useCallback(
    (alpha: number) => {
      const $canvas = document.getElementById(layerId)
      if (!($canvas instanceof HTMLCanvasElement)) return toast.error('😟 Lienzo no encontrado')
      setRepaint('all')
      setLocalOpacity(alpha)
      opacityChange(alpha)
    },
    [layerId, opacityChange, setLocalOpacity, setRepaint]
  )

  return (
    <>
      <button className='canvasLayer-alpha' onClick={handleClick}>
        <BlendIcon />
      </button>
      {active && (
        <div className='canvasLayer-opacityController'>
          <p>
            <b>{rangeOpacity}%</b> de Opacidad
          </p>
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
