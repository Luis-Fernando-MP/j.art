import { acl } from '@/shared/acl'
import { BabyIcon, FlameIcon, LeafyGreenIcon, PaletteIcon } from 'lucide-react'
import type { JSX } from 'react'

import PixelStore from '../../store/pixel.store'
import { basicColors } from './colors.'
import './style.scss'

interface IBoardColors {
  className?: string
}

const BoardColors = ({ className = '' }: IBoardColors): JSX.Element => {
  const { pixelColor, setPixelColor } = PixelStore()
  return (
    <section className={`${className} colorsTools`}>
      <div className='colorsTools-section'>
        <button className='colorsTools-action'>
          <PaletteIcon />
        </button>
      </div>
      <div className='colorsTools-section'>
        {basicColors.map(color => {
          const key = `${color.join()}-basic-color`
          const [r, g, b, a] = color
          const rgbColor = `rgb(${r},${g},${b},${a})`
          return (
            <button
              key={key}
              className={`colorsTools-color ${acl(pixelColor === rgbColor)}`}
              onClick={() => setPixelColor(rgbColor)}
              style={{ backgroundColor: rgbColor }}
            />
          )
        })}
      </div>
      <div className='colorsTools-section'>
        <button className='colorsTools-action'>
          <BabyIcon />
        </button>
        <button className='colorsTools-action'>
          <LeafyGreenIcon />
        </button>
        <button className='colorsTools-action'>
          <FlameIcon />
        </button>
      </div>
      <div className='colorsTools-styles'></div>
    </section>
  )
}

export default BoardColors
