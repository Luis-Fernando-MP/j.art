'use client'

import HorizontalSlider from '@/shared/components/HorizontalSlider'
import { BabyIcon, FlameIcon, LeafyGreenIcon, PaletteIcon } from 'lucide-react'
import type { JSX } from 'react'

import Color from './Color'
import { basicColors } from './colors.'
import './style.scss'

interface IBoardColors {
  className?: string
}

const BoardColors = ({ className = '' }: IBoardColors): JSX.Element => {
  return (
    <section className={`${className} colorsTools`}>
      <div className='colorsTools-section'>
        <button className='colorsTools-action'>
          <PaletteIcon />
        </button>
      </div>
      <HorizontalSlider className='colorsTools-colors'>
        {basicColors.map(color => {
          const key = `${color.join()}-basic-color`
          const [r, g, b, a] = color
          const rgbColor = `rgb(${r},${g},${b},${a})`
          return <Color key={key} rgbColor={rgbColor} className='colorsTools-color' />
        })}
      </HorizontalSlider>
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
