'use client'

import { acl } from '@/shared/acl'
import VerticalText from '@/shared/components/VerticalText'
import { BabyIcon, FlameIcon, LeafyGreenIcon } from 'lucide-react'
import type { JSX } from 'react'

import PixelStore from '../../store/pixel.store'
import { basicColors } from './colors.'
import './style.scss'

interface IColorsTools {
  className?: string
}

const ColorsTools = ({ className = '' }: IColorsTools): JSX.Element => {
  const { pixelColor, setPixelColor } = PixelStore()
  return (
    <section className={`${className} colorsTools`}>
      <VerticalText>Colores</VerticalText>
      <div className='colorsTools-basics'>
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
      <div className='colorsTools-actions'>
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

export default ColorsTools
