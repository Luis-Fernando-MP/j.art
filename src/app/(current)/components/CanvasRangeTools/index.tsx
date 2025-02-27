import Range from '@/shared/components/Range'
import { RulerIcon } from 'lucide-react'
import type { JSX } from 'react'

import PixelStore from '../../store/pixel.store'
import HueRange from './HueRange'
import './style.scss'

const CanvasRangeTools = (): JSX.Element => {
  const { pixelSize, setPixelSize } = PixelStore()

  const handleChangePixelSize = (size: number) => {
    setPixelSize(size)

    const root = document.documentElement
    if (!root) return
    console.log(root.style.getPropertyValue('--s-grid'))
    root.style.setProperty('--s-grid', `${size}px`)
  }

  return (
    <div className='canvasRangeTools'>
      <div className='canvasRangeTools-container'>
        <h4 className='canvasRangeTools-paragraph'>{pixelSize}px pixeles</h4>
        <Range step={15} min={15} max={150} rangeValue={pixelSize} handleChange={handleChangePixelSize} />
        <RulerIcon />
      </div>
      <HueRange />
    </div>
  )
}

export default CanvasRangeTools
