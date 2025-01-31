'use client'

import { acl } from '@/shared/acl'
import VerticalText from '@/shared/components/VerticalText'
import type { JSX } from 'react'

import CanvasStore from '../../store/canvas.store'
import { basicColors } from './colors.'
import './style.scss'

interface IColorsTools {
  className?: string
}

const ColorsTools = ({ className = '' }: IColorsTools): JSX.Element => {
  const { pixelColor, setPixelColor } = CanvasStore()
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
    </section>
  )
}

export default ColorsTools
